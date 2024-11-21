import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Company, Configuration } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { Emails } from './validators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Timestamp } from '@angular/fire/firestore';
import { ClosedFormWarningMessageComponent } from 'src/app/v3/closed-form-warning-message.component';

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
  enabled?: boolean;
}
type Options = Option[];

@Component({
    selector: 'cms-form',
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        ClosedFormWarningMessageComponent,
    ],
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input()
  readOnly = false;

  @Input()
  company: Observable<Company> = of(defaultCompany);

  @Output()
  public submitEvent = new EventEmitter<Company>();

  companyProfile: FormGroup | undefined;

  submitted = false;

  options: Options = [];
  enabled = false;
  openingDate: Timestamp | undefined;
  updatedCompany: Company = {} as Company;
  config: Configuration | undefined;

  private readonly partnerService = inject(PartnerService);
  async ngOnInit() {
    this.config = await this.partnerService.getCurrentConfiguration();

    if (!!this.config) {
      this.enabled = this.config.enabled;
      this.openingDate = this.config.openingDate;
      this.options = this.config.sponsorships.map((sponsorship) => {
        return {
          enabled: this.config![sponsorship.name.toLocaleLowerCase()] > 0,
          value: sponsorship.name.toLowerCase(),
          label: !sponsorship.price
            ? sponsorship.name
            : `${sponsorship.name} (${sponsorship?.price} euros)`,
        };
      });

      this.company.subscribe((c) => {
        this.updatedCompany = c;
        if (this.config) {
          this.companyProfile = this.initFormGroup(c);
        }
      });
    }
  }

  private initFormGroup(company: Company) {
    const formGroup = new FormGroup({
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
      ...(this.config?.sponsoringOptions || [])?.reduce((acc, option) => {
        return {
          ...acc,
          ['options_' + option.key]: new FormControl({
            value: !!company.sponsoringOptions?.find(
              (o) => o.key === option.key,
            ),
            disabled: this.readOnly,
          }),
        };
      }, {}),
    });

    return formGroup;
  }
  onSubmitForm() {
    window.scrollTo(0, 0);
    this.submitted = true;

    const formValues: Record<string, any> = this.companyProfile?.value;

    const options = Object.entries(formValues).reduce(
      (acc: Record<string, boolean>, [key, value]: [string, any]) => {
        if (key.startsWith('options_')) {
          return {
            ...acc,
            [key]: !!value,
          };
        }
        return {
          ...acc,
        };
      },
      {},
    );

    const formWithoutOptions = Object.entries(formValues).reduce(
      (acc: Record<string, boolean>, [key, value]: [string, any]) => {
        if (key.indexOf('options_') < 0) {
          return {
            ...acc,
            [key]: value,
          };
        }
        return {
          ...acc,
        };
      },
      {},
    );

    const company: Company = {
      ...this.updatedCompany,
      ...formWithoutOptions,
      sponsoringOptions: this.config?.sponsoringOptions?.filter(
        (sponsoring) => {
          return !!options[`options_${sponsoring.key}`];
        },
      ),
    };

    this.submitEvent.emit(company);
  }
}
