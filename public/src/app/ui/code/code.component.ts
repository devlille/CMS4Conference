import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
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

  billetWebUrl: string | undefined;
  activities!: string;
  standInstallationTime!: string;
  standPhoneNumber!: string;

  private readonly partnerService = inject(PartnerService);

  ngOnInit() {
    this.billetWebUrl = this.company().billetWebUrl;
    this.activities = this.company().activities ?? '';
    this.standInstallationTime = this.company().standInstallationTime ?? '';
    this.standPhoneNumber = this.company().standPhoneNumber ?? '';
  }

  updateSponsoring() {
    this.partnerService.update(this.id()!, {
      activities: this.activities,
      standInstallationTime: this.standInstallationTime,
      standPhoneNumber: this.standPhoneNumber
    });
  }
}
