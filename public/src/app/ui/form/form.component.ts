import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Company } from '../../model/company';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PartnerService } from '../../services/partner.service';
import { Emails, Siret } from './validators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
const defaultCompany: Company = {
  name: '',
  officialName: '',
  tel: '',
  address: '',
  zipCode: '',
  city: '',
  siret: '',
  representant: '',
  email: '',
  role: '',
  sponsoring: '',
  secondSponsoring: '',
  status: {},
  devisUrl: '',
  conventionUrl: '',
  invoiceUrl: '',
  siteUrl: '',
  invoiceType: 'facture',
};

interface Option {
  value: string;
  label: string;
  enabled: boolean;
}
type Options = Option[];

@Component({
  selector: 'cms-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @Input()
  readOnly = false;

  @Input()
  company: Observable<Company> = of(defaultCompany);

  @Output()
  public submitEvent = new EventEmitter<Company>();

  companyProfile: FormGroup = this.initFormGroup(defaultCompany);

  submitted = false;

  options: Options = [];
  updatedCompany: Company = {} as Company;

  private partnerService = inject(PartnerService);

  async ngOnInit() {
    const config = (await this.partnerService.getCurrentConfiguration()) as any;
    this.options = [
      {
        value: 'Platinium',
        label: 'Platinium',
        enabled: config.platinium > 0,
      },
      {
        value: 'Gold',
        label: 'Gold',
        enabled: config.gold > 0,
      },
      {
        value: 'Silver',
        label: 'Silver',
        enabled: config.silver > 0,
      },
      {
        value: 'Bronze',
        label: 'Bronze',
        enabled: config.bronze > 0,
      },
      {
        value: 'Party',
        label: 'Party',
        enabled: config.party > 0,
      },
      {
        value: 'Newsletter',
        label: 'Etre notifié pour le Devfest Lille 2025',
        enabled: true,
      },
    ];
    this.company.subscribe((c) => {
      this.updatedCompany = c;
      this.companyProfile = this.initFormGroup(c);
    });
  }

  private initFormGroup(company: Company) {
    return new FormGroup({
      name: new FormControl({ value: company.name, disabled: false }, [
        Validators.required,
      ]),
      tel: new FormControl({ value: company.tel, disabled: false }, [
        Validators.required,
      ]),
      email: new FormControl({ value: company.email, disabled: false }, [
        Validators.required,
        Emails(),
      ]),
      sponsoring: new FormControl(
        { value: company.sponsoring, disabled: this.readOnly },
        [Validators.required],
      ),
      secondSponsoring: new FormControl({
        value: company.secondSponsoring,
        disabled: this.readOnly,
      }),
    });
  }
  onSubmitForm() {
    window.scrollTo(0, 0);
    this.submitted = true;

    const company = {
      ...this.updatedCompany,
      ...this.companyProfile.value,
    };

    this.submitEvent.emit({
      ...company,
    });
  }
}
