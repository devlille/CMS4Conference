import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company } from '../../model/company';
import { FilesComponent } from '../files/files.component';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'cms-paid',
  standalone: true,
  imports: [CommonModule, FilesComponent],
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.scss'],
})
export class PaidComponent {
  @Input({ required: true }) workflow!: Workflow;
  @Input({ required: true }) step!: WorkflowStep;
  @Input({ required: true }) company!: Company;
  files = {};

  private readonly storageService = inject(StorageService);
  ngOnInit() {
    this.storageService.getInvoice(this.company.id!).then((invoice) => {
      this.files = {
        Facture: invoice,
      };
    });
  }
}
