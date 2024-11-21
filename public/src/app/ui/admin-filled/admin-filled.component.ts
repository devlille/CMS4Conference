import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'cms-admin-filled',
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
    ],
    templateUrl: './admin-filled.component.html'
})
export class AdminFilledComponent {
  readonly company = input<Company>();
  readonly id = input<string>();
  readonly step = input<WorkflowStep>();

  private readonly partnerService = inject(PartnerService);

  update() {
    this.partnerService.update(this.id()!, {
      type: this.company()?.type,
    });
  }
}
