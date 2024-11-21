import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';

import { Company } from '../model/company';
import { PartnerService } from '../services/partner.service';
import { FormComponent } from '../ui/form/form.component';

@Component({
  selector: 'cms-register-form',
  imports: [CommonModule, FormComponent, MatCardModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  submitted = false;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly partnerservice = inject(PartnerService);

  createPartner(company: Company) {
    this.partnerservice
      .add({
        ...company,
        edition: this.activatedRoute.snapshot.params['edition'] || 2025
      })
      .then(() => {
        this.submitted = true;
      });
  }
}
