import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { Workflow, WorkflowStep, Company } from '../../model/company';
import { StorageService } from '../../storage.service';
import { FilesComponent } from '../files/files.component';

@Component({
  selector: 'cms-paid',
  imports: [CommonModule, FilesComponent],
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.css']
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
        Facture: invoice
      };
    });
  }
}
