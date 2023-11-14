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
  }
}
