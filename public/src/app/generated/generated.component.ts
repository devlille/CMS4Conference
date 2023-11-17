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
import { FormsModule } from '@angular/forms';
import { AddPipe } from '../pipe/add.pipe';
import { Auth } from '@angular/fire/auth';

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
    FormsModule,
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

  ngOnInit() {
    if (!this.company) {
      return;
    }

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
    const sponsor: Partial<Company> = {
      officialName: this.company?.officialName,
      siteUrl: this.company?.siteUrl,
      address: this.company?.address,
      siret: this.company?.siret,
      role: this.company?.role,
      representant: this.company?.representant,
      lang: this.company?.lang,
    };

    if (this.company?.PO) {
      sponsor.PO = this.company?.PO;
    }
    this.partnerService.update(this.id!, sponsor);
  }
}
