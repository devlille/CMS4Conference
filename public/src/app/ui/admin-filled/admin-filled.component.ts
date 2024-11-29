import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Company, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'cms-admin-filled',
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './admin-filled.component.html'
})
export class AdminFilledComponent {
  readonly company = input<Company>();
  readonly id = input<string>();
  readonly step = input<WorkflowStep>();

  private readonly partnerService = inject(PartnerService);
  private readonly formBuilder = inject(FormBuilder);

  form = computed(() => {
    return this.formBuilder.group({
      type: new FormControl((this.company as unknown as Company)?.type)
    });
  });

  update() {
    this.partnerService.update(this.id as unknown as string, {
      ...this.form().value
    });
  }
}
