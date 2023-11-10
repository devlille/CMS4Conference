import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../ui/form/form.component';
import { ActivatedRoute } from '@angular/router';
import { PartnerService } from '../services/partner.service';
import { Company } from '../model/company';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'cms-register-form',
    standalone: true,
    imports: [CommonModule, FormComponent, MatCardModule],
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
    submitted = false;
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly partnerservice = inject(PartnerService);

    createPartner(company: Company) {
        this.partnerservice
            .add({
                ...company,
                edition: this.activatedRoute.snapshot.params['edition'] || 2024,
            })
            .then(() => {
                this.submitted = true;
            });
    }
}
