import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../environments/environment';
import { Company, State, Workflow, WorkflowStep } from '../model/company';
import { AddPipe } from '../pipe/add.pipe';
import { PartnerService } from '../services/partner.service';
import { StorageService } from '../storage.service';
import { FilesComponent } from '../ui/files/files.component';
import { Siret } from '../ui/form/validators';
import { UploadComponent } from '../ui/upload/upload.component';

@Component({
  selector: 'cms-generated',
  imports: [CommonModule, UploadComponent, FilesComponent, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, AddPipe],
  templateUrl: './generated.component.html',
  styleUrl: './generated.component.scss'
})
export class GeneratedComponent {
  readonly workflow = input<Workflow>();
  readonly step = input<WorkflowStep>();
  readonly company = input<Company>();
  readonly id = input<string>();

  isAdmin = signal(false);
  companySignal = computed(() => this.company as unknown as Company);

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth: Auth = inject(Auth);
  private readonly toastr: ToastrService = inject(ToastrService);

  form = computed(() => {
    const company = this.companySignal();
    return new FormGroup({
      officialName: new FormControl(company.officialName),
      address: new FormControl(company.address, Validators.required),
      siret: new FormControl(company.siret, {
        validators: [Validators.required, Siret()]
      }),
      representant: new FormControl(company.representant, Validators.required),
      role: new FormControl(company.role, Validators.required),
      siteUrl: new FormControl(company.siteUrl, Validators.required),
      invoiceType: new FormControl(company.invoiceType, Validators.required),
      PO: new FormControl(company.PO),
      lang: new FormControl(company.lang, Validators.required)
    });
  });

  filesResources = resource({
    request: () => ({ company: this.companySignal() }),
    loader: ({ request: { company } }): Promise<string[]> => {
      const step = this.step as unknown as WorkflowStep;

      if (step?.state !== 'done') {
        return Promise.resolve([]);
      }
      return Promise.all([
        this.storageService.getDepositInvoice(company.id!),
        this.storageService.getConvention(company.id!),
        this.storageService.getProformaInvoice(company.id!),
        this.storageService.getDevis(company.id!),
        this.storageService.getInvoice(company.id!)
      ]);
    }
  });

  files = computed(() => {
    const resources = this.filesResources.value();
    if (!resources) {
      return { ...environment.files };
    }
    const [deposit, convention, proforma, devis, invoice] = resources;
    return {
      'Facture Accompte 100%': deposit,
      Convention: convention,
      'Facture Proforma': proforma,
      Devis: devis,
      Facture: invoice,
      ...environment.files
    };
  });

  ngOnInit() {
    this.auth.onAuthStateChanged((state) => {
      this.isAdmin.set(state?.email?.endsWith('@' + environment.emailDomain) ?? false);
    });
  }

  uploadConvention(file: Blob) {
    this.storageService.uploadConvention(this.id as unknown as string, file).then((url) => {
      this.partnerService.update(this.id as unknown as string, {
        conventionUrl: url
      });
    });
  }
  uploadDevis(file: Blob) {
    this.storageService.uploadDevis(this.id as unknown as string, file).then((url) => {
      this.partnerService.update(this.id as unknown as string, {
        devisUrl: url
      });
    });
  }

  regenerate() {
    this.updateStatus('retry');
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id as unknown as string, {
      status: {
        ...(this.companySignal()?.status ?? {}),
        [(this.step as unknown as WorkflowStep)?.key ?? '']: status
      }
    });
  }
  setDone() {
    this.updateStatus('done');
  }

  updateSponsoring() {
    const sponsor: Partial<Company> = this.form().value as Partial<Company>;
    this.partnerService.update(this.id as unknown as string, sponsor).then(() => this.toastr.success('Les informations ont été sauvegardées'));
  }
}
