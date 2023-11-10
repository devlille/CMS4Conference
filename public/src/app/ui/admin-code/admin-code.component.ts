import { Component, Input, inject } from '@angular/core';
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
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './admin-code.component.html',
  styleUrls: ['./admin-code.component.scss'],
})
export class AdminCodeComponent {
  @Input({ required: true }) company!: Company;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) step!: WorkflowStep;

  private readonly partnerService = inject(PartnerService);

  ngOnInit() {}

  updateBilletwebUrl() {
    this.partnerService.update(this.id, {
      billetWebUrl: this.company.billetWebUrl,
    });
  }

  updateBilletwebDone() {
    this.partnerService.update(this.id, {
      billetWebDone: true,
    });
  }
}
