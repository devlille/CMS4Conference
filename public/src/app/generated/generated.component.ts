import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../environments/environment';
import { Workflow, WorkflowStep, Company, State } from '../model/company';
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
  files: Record<string, string> = {
    ...environment.files
  };
  isAdmin = false;
  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth: Auth = inject(Auth);
  private readonly toastr: ToastrService = inject(ToastrService);

  form!: FormGroup;

  ngOnInit() {
    const company = this.company();
    if (!company) {
      return;
    }
    this.form = new FormGroup({
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

    const step = this.step();
    if (step?.state === 'done') {
      this.storageService.getDepositInvoice(company.id!).then((deposit) => {
        this.files = {
          ...this.files,
          'Facture Accompte 100%': deposit
        };
      });
    }

    this.auth.onAuthStateChanged((state) => {
      this.isAdmin = state?.email?.endsWith('@' + environment.emailDomain) ?? false;
    });

    if (step?.state === 'done') {
      Promise.all([
        this.storageService.getConvention(company.id!),
        this.storageService.getProformaInvoice(company.id!),
        this.storageService.getDevis(company.id!),
        this.storageService.getInvoice(company.id!)
      ]).then(([convention, proforma, devis, invoice]) => {
        this.files = {
          ...this.files,
          Convention: convention,
          'Facture Proforma': proforma,
          Devis: devis,
          Facture: invoice
        };
      });
    }
  }

  uploadConvention(file: Blob) {
    this.storageService.uploadConvention(this.id()!, file).then((url) => {
      this.partnerService.update(this.id()!, {
        conventionUrl: url
      });
    });
  }
  uploadDevis(file: Blob) {
    this.storageService.uploadDevis(this.id()!, file).then((url) => {
      this.partnerService.update(this.id()!, {
        devisUrl: url
      });
    });
  }

  regenerate() {
    this.updateStatus('retry');
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id()!, {
      status: {
        ...(this.company()?.status ?? {}),
        [this.step()?.key ?? '']: status
      }
    });
  }
  setDone() {
    this.updateStatus('done');
  }

  updateSponsoring() {
    const sponsor: Partial<Company> = this.form.value;
    this.partnerService.update(this.id()!, sponsor).then(() => this.toastr.success('Les informations ont été sauvegardées'));
  }
}
