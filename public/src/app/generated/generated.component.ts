import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company, State } from '../model/company';
import { PartnerService } from '../services/partner.service';
import { StorageService } from '../storage.service';
import { UploadComponent } from '../ui/upload/upload.component';
import { FilesComponent } from '../ui/files/files.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddPipe } from '../pipe/add.pipe';
import { Auth } from '@angular/fire/auth';
import { Siret } from '../ui/form/validators';

@Component({
  selector: 'cms-generated',
  standalone: true,
  imports: [
    CommonModule,
    UploadComponent,
    FilesComponent,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AddPipe,
  ],
  templateUrl: './generated.component.html',
  styleUrl: './generated.component.scss',
})
export class GeneratedComponent {
  @Input() workflow: Workflow | undefined;
  @Input() step: WorkflowStep | undefined;
  @Input() company: Company | undefined;
  @Input() id: string | undefined;
  files = {};
  isAdmin = false;
  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth: Auth = inject(Auth);
  form!: FormGroup;

  ngOnInit() {
    if (!this.company) {
      return;
    }
    console.log(this.company);
    this.form = new FormGroup({
      officialName: new FormControl(this.company.officialName),
      address: new FormControl(this.company.address, Validators.required),
      siret: new FormControl(this.company.siret, {
        validators: [Validators.required, Siret()],
      }),
      representant: new FormControl(
        this.company.representant,
        Validators.required,
      ),
      role: new FormControl(this.company.role, Validators.required),
      siteUrl: new FormControl(this.company.siteUrl, Validators.required),
      invoiceType: new FormControl(
        this.company.invoiceType,
        Validators.required,
      ),
      PO: new FormControl(this.company.PO),
      lang: new FormControl(this.company.lang, Validators.required),
    });

    this.storageService.getDepositInvoice(this.company.id!).then((deposit) => {
      this.files = {
        ...this.files,
        'Facture Accompte 100%': deposit,
      };
    });

    this.auth.onAuthStateChanged((state) => {
      this.isAdmin = state?.email?.endsWith('@gdglille.org') ?? false;
    });

    Promise.all([
      this.storageService.getConvention(this.company.id!),
      this.storageService.getProformaInvoice(this.company.id!),
      this.storageService.getDevis(this.company.id!),
      this.storageService.getInvoice(this.company.id!),
    ]).then(([convention, proforma, devis, invoice]) => {
      this.files = {
        Convention: convention,
        'Facture Proforma': proforma,
        Devis: devis,
        Facture: invoice,
        'RIB du GDG Lille': '/assets/RIB.pdf',
        'Journal Officiel suite à la création du GDG Lille':
          '/assets/JournalOfficiel.pdf',
      };
    });
  }

  uploadConvention(file: Blob) {
    this.storageService.uploadConvention(this.id!, file).then((url) => {
      this.partnerService.update(this.id!, {
        conventionUrl: url,
      });
    });
  }
  uploadDevis(file: Blob) {
    this.storageService.uploadDevis(this.id!, file).then((url) => {
      this.partnerService.update(this.id!, {
        devisUrl: url,
      });
    });
  }

  regenerate() {
    this.updateStatus('retry');
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id!, {
      status: {
        ...(this.company?.status ?? {}),
        [this.step?.key ?? '']: status,
      },
    });
  }
  setDone() {
    this.updateStatus('done');
  }

  updateSponsoring() {
    const sponsor: Partial<Company> = this.form.value;
    this.partnerService.update(this.id!, sponsor);
  }
}
