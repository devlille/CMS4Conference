import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Workflow, WorkflowStep, Company } from '../../model/company';
import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'cms-code',
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent {
  readonly workflow = input.required<Workflow>();
  readonly step = input.required<WorkflowStep>();
  readonly company = input.required<Company>();
  readonly id = input<string>();

  idSignal = computed(() => this.id as unknown as string);
  stepSignal = computed(() => this.step as unknown as WorkflowStep);
  workflowSignal = computed(() => this.workflow as unknown as Workflow);
  companySignal = computed(() => this.company as unknown as Company);

  billetWebUrl: string | undefined;
  activities!: string;
  standInstallationTime!: string;
  standPhoneNumber!: string;

  private readonly partnerService = inject(PartnerService);

  ngOnInit() {
    this.billetWebUrl = this.companySignal().billetWebUrl;
    this.activities = this.companySignal().activities ?? '';
    this.standInstallationTime = this.companySignal().standInstallationTime ?? '';
    this.standPhoneNumber = this.companySignal().standPhoneNumber ?? '';
  }

  updateSponsoring() {
    this.partnerService.update(this.idSignal()!, {
      activities: this.activities,
      standInstallationTime: this.standInstallationTime,
      standPhoneNumber: this.standPhoneNumber
    });
  }
}
