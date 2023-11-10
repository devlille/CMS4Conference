/// <reference  types="@types/googlemaps"  />

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
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
    imports: [CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule],
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
    place: google.maps.places.PlaceResult | undefined;
    updatedCompany: Company = {} as Company;

    private partnerService = inject(PartnerService);

    @ViewChild('address', { static: false }) address: ElementRef | undefined;

    ngAfterViewInit(): void {
        this.getPlaceAutocomplete();
    }
    getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.address!.nativeElement, {
            componentRestrictions: { country: 'FR' },
            types: ['establishment', 'geocode'],
        });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            this.place = autocomplete.getPlace();
        });
    }

    async ngOnInit() {
        const config = (await this.partnerService.getCurrentConfiguration()) as any;
        console.log(config);
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
                value: 'Newsletter',
                label: 'Etre notifié pour le Devfest Lille 2025',
                enabled: true,
            },
        ];
        this.company.subscribe(c => {
            this.updatedCompany = c;
            this.companyProfile = this.initFormGroup(c);
        });
    }

    private initFormGroup(company: Company) {
        return new FormGroup({
            name: new FormControl({ value: company.name, disabled: false }, [Validators.required]),
            officialName: new FormControl({ value: company.officialName, disabled: false }, []),
            tel: new FormControl({ value: company.tel, disabled: false }, [Validators.required]),
            googleAddress: new FormControl(
                {
                    value: `${company.address} ${company.zipCode} ${company.city}`,
                    disabled: false,
                },
                [Validators.required]
            ),
            siret: new FormControl({ value: company.siret, disabled: false }, [Validators.required, Siret()]),
            representant: new FormControl({ value: company.representant, disabled: false }, [Validators.required]),
            email: new FormControl({ value: company.email, disabled: false }, [Validators.required, Emails()]),
            role: new FormControl({ value: company.role, disabled: false }, [Validators.required]),
            sponsoring: new FormControl({ value: company.sponsoring, disabled: this.readOnly }, [Validators.required]),
            secondSponsoring: new FormControl({ value: company.secondSponsoring, disabled: this.readOnly }),
            siteUrl: new FormControl({ value: company.siteUrl, disabled: false }),
        });
    }
    onSubmitForm() {
        window.scrollTo(0, 0);
        this.submitted = true;

        const company = {
            ...this.updatedCompany,
            ...this.companyProfile.value,
        };

        let geolocalisation: { address: string; zipCode?: string; city?: string; location?: any } = {
            address: company.googleAddress,
        };

        // We remove the googleAddress property from the object because this property should not be stored.
        delete company.googleAddress;

        // If the user has selected an address from the Google Map Autocomplete
        if (!!this.place) {
            let streetNumber = '';
            let route = '';
            let zipCode = '';
            let city = '';

            if (!!this.place?.address_components?.find(a => a.types.indexOf('street_number') >= 0)) {
                streetNumber = this.place?.address_components?.find(a => a.types.indexOf('street_number') >= 0)?.long_name || '';
            }
            if (!!this.place?.address_components?.find(a => a.types.indexOf('route') >= 0)) {
                route = this.place?.address_components?.find(a => a.types.indexOf('route') >= 0)?.long_name || '';
            }
            if (!!this.place?.address_components?.find(a => a.types.indexOf('postal_code') >= 0)) {
                zipCode = this.place?.address_components?.find(a => a.types.indexOf('postal_code') >= 0)?.long_name || '';
            }
            if (!!this.place?.address_components?.find(a => a.types.indexOf('locality') >= 0)) {
                city = this.place?.address_components?.find(a => a.types.indexOf('locality') >= 0)?.long_name || '';
            }

            const location = {
                lat: this.place?.geometry?.location?.lat(),
                lng: this.place?.geometry?.location?.lng(),
            };
            geolocalisation = {
                address: `${streetNumber} ${route}`,
                zipCode,
                city,
                location,
            };
        }

        this.submitEvent.emit({
            ...company,
            ...geolocalisation,
        });
    }
}
