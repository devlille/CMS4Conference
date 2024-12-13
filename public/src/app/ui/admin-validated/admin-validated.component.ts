import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { environment } from '../../../environments/environment';
import { Company, State, Workflow, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'cms-admin-validated',
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './admin-validated.component.html',
  styleUrls: ['./admin-validated.component.css']
})
export class AdminValidatedComponent {
  readonly workflow = input<Workflow>();
  readonly step = input<WorkflowStep>();
  readonly company = input.required<Company>();
  readonly id = input<string>();

  companySignal = computed(() => this.company as unknown as Company);
  files = {};
  choice = '';
  isAdmin = signal(true);

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(Auth);
  private readonly formBuilder = inject(FormBuilder);

  form = computed(() => {
    return this.formBuilder.group({
      sponsoring: new FormControl((this.company as unknown as Company).sponsoring)
    });
  });

  optionsResources = resource({
    loader: () => this.partnerService.getCurrentConfiguration()
  });

  options = computed(() => {
    const optionsFromFirestore = this.optionsResources.value();

    if (!optionsFromFirestore) {
      return;
    }

    const options = optionsFromFirestore.sponsorships.map((sponsorship) => ({
      value: sponsorship.name.toLowerCase(),
      label: sponsorship.name.toLowerCase()
    }));
    if (this.isAdmin()) {
      return options;
    } else {
      const firstAndSecondOptions = [options.find(({ value }) => value === this.company().sponsoring.toLowerCase())!];

      if (this.company()?.secondSponsoring) {
        firstAndSecondOptions.push(options.find(({ value }) => value === this.company().secondSponsoring?.toLocaleLowerCase())!);
      }

      return firstAndSecondOptions;
    }
  });

  async ngOnInit() {
    this.auth.onAuthStateChanged((state) => {
      this.isAdmin.set(state?.email?.endsWith('@' + environment.emailDomain) ?? false);
    });
  }
  updateStatus(status: State) {
    this.partnerService.update(this.id as unknown as string, {
      status: {
        ...(this.companySignal()?.status ?? {}),
        [(this.step as unknown as WorkflowStep)?.key ?? '']: status
      }
    });
  }
  setDone() {
    this.updateStatus('done');
  }

  setKo() {
    this.updateStatus('refused');
  }
  updateSponsoring() {
    const company = this.companySignal();
    this.partnerService.update(this.id as unknown as string, {
      sponsoring: this.form().value.sponsoring!,
      secondSponsoring: this.form().value.sponsoring! === company?.sponsoring ? company?.secondSponsoring : company?.sponsoring
    });
  }
}
