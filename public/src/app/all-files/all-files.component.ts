import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../model/company';
import { StorageService } from '../storage.service';
import { FilesComponent } from '../ui/files/files.component';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'cms-all-files',
  standalone: true,
  imports: [CommonModule, FilesComponent],
  templateUrl: './all-files.component.html',
  styleUrl: './all-files.component.scss',
})
export class AllFilesComponent implements OnInit {
  private readonly partnerStore = inject(StoreService);

  files: { [key: string]: string } = {
    'RIB du GDG Lille': '/assets/RIB.pdf',
    'Journal Officiel suite à la création du GDG Lille':
      '/assets/JournalOfficiel.pdf',
  };

  private readonly storageService = inject(StorageService);

  ngOnInit(): void {
    this.partnerStore.partner$.subscribe((partner) => {
      this.getFiles(partner);
    });
  }

  getFiles(company: Company | null): void {
    if (!company) {
      return;
    }
    if (company?.flyerUrl) {
      this.storageService.getFlyers(company.id!).then((flyer) => {
        this.files = {
          ...this.files,
          Flyer: flyer,
        };
      });
    }

    if (company?.status?.generated === 'done') {
      this.storageService.getDepositInvoice(company.id!).then((deposit) => {
        this.files = {
          ...this.files,
          'Facture Accompte 100%': deposit,
        };
      });

      Promise.all([
        this.storageService.getConvention(company.id!),
        this.storageService.getProformaInvoice(company.id!),
        this.storageService.getDevis(company.id!),
        this.storageService.getInvoice(company.id!),
      ]).then(([convention, proforma, devis, invoice]) => {
        this.files = {
          ...this.files,
          Convention: convention,
          'Facture Proforma': proforma,
          Devis: devis,
          Facture: invoice,
        };
      });
    }
  }
}
