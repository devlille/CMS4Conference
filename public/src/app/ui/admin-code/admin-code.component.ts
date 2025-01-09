import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Company, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'cms-admin-code',
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './admin-code.component.html',
  styleUrls: ['./admin-code.component.css']
})
export class AdminCodeComponent {
  readonly company = input.required<Company>();
  readonly id = input.required<string>();
  readonly step = input.required<WorkflowStep>();

  idSignal = computed(() => this.id as unknown as string);
  stepSignal = computed(() => this.step as unknown as WorkflowStep);
  companySignal = computed(() => this.company as unknown as Company);

  private readonly partnerService = inject(PartnerService);

  updateBilletwebUrl() {
    this.partnerService.update(this.idSignal(), {
      billetWebUrl: this.companySignal().billetWebUrl ?? '',
      wldId: this.companySignal().wldId ?? '',
      standInstallationTime: this.companySignal().standInstallationTime,
      standPhoneNumber: this.companySignal().standPhoneNumber
    });
  }

  updateBilletwebDone() {
    this.partnerService.update(this.idSignal(), {
      billetWebDone: true
    });
  }
}
