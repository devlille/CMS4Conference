import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company } from '../../model/company';
import { FilesComponent } from '../files/files.component';
import { AddPipe } from '../../pipe/add.pipe';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'cms-validated',
  standalone: true,
  imports: [CommonModule, FilesComponent, AddPipe],
  templateUrl: './validated.component.html',
  styleUrls: ['./validated.component.scss'],
})
export class ValidatedComponent {
  @Input() workflow: Workflow | undefined;
  @Input() step: WorkflowStep | undefined;
  @Input() company: Company | undefined;
  files = {};

  private readonly storageService = inject(StorageService);

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
}
