import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company } from '../../model/company';
import { FilesComponent } from '../files/files.component';
import { StorageService } from '../../storage.service';

@Component({
    selector: 'cms-paid',
    imports: [CommonModule, FilesComponent],
    templateUrl: './paid.component.html',
    styleUrls: ['./paid.component.scss']
})
export class PaidComponent {
  readonly workflow = input.required<Workflow>();
  readonly step = input.required<WorkflowStep>();
  readonly company = input.required<Company>();
  files = {};

  private readonly storageService = inject(StorageService);
  ngOnInit() {
    this.storageService.getInvoice(this.company().id!).then((invoice) => {
      this.files = {
        Facture: invoice,
      };
    });
  }
}
