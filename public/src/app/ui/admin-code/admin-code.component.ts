import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'cms-admin-code',
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
    ],
    templateUrl: './admin-code.component.html',
    styleUrls: ['./admin-code.component.scss']
})
export class AdminCodeComponent {
  readonly company = input.required<Company>();
  readonly id = input.required<string>();
  readonly step = input.required<WorkflowStep>();

  private readonly partnerService = inject(PartnerService);


  updateBilletwebUrl() {
    this.partnerService.update(this.id(), {
      billetWebUrl: this.company().billetWebUrl ?? '',
      wldId: this.company().wldId ?? '',
      standInstallationTime: this.company().standInstallationTime,
      standPhoneNumber: this.company().standPhoneNumber,
    });
  }

  updateBilletwebDone() {
    this.partnerService.update(this.id(), {
      billetWebDone: true,
    });
  }
}
