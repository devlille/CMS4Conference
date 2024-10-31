import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerService } from '../../services/partner.service';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../model/company';
import { Auth } from '@angular/fire/auth';
import { FormComponent } from '../form/form.component';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'cms-info',
  standalone: true,
  imports: [CommonModule, FormComponent],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent {
  isAdmin = false;
  partner$: Observable<Company> | undefined;
  id: string;

  private readonly partnerService = inject(PartnerService);
  private readonly route = inject(ActivatedRoute);
  private readonly auth: Auth = inject(Auth);

  constructor() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.partner$ = from(
      this.partnerService.get(this.id).then((partner) => {
        const email = Array.isArray(partner.email)
          ? partner.email.join(',')
          : partner.email;
        return {
          ...partner,
          email,
        };
      }),
    );

    this.auth.onAuthStateChanged((state) => {
      this.isAdmin =
        state?.email?.endsWith('@' + environment.emailDomain) ?? false;
    });
  }

  onSubmit(company: Company) {
    this.partnerService.update(this.id, company);
  }
}
