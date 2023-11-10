import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, WorkflowStep } from '../../model/company';
import { FilesComponent } from '../files/files.component';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'cms-communicated',
  standalone: true,
  imports: [CommonModule, FilesComponent],
  templateUrl: './communicated.component.html',
  styleUrls: ['./communicated.component.scss'],
})
export class CommunicatedComponent {
  @Input({ required: true }) company!: Company;
  @Input({ required: true }) step!: WorkflowStep;

  files = {};

  private readonly storageService = inject(StorageService);

  ngOnInit() {
    this.storageService.getFlyers(this.company.id!).then((flyer) => {
      this.files = {
        Flyer: flyer,
      };
    });
  }
}
