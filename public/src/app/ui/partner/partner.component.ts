import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AllFilesComponent } from '../../all-files/all-files.component';
import { Company } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { StoreService } from '../../services/store.service';
import { InfoComponent } from '../info/info.component';
import { LoaderComponent } from '../loader/loader.component';
import { WorkflowComponent } from '../workflow/workflow.component';

@Component({
  selector: 'cms-partner',
  imports: [CommonModule, MatTabsModule, RouterModule, LoaderComponent, InfoComponent, WorkflowComponent, MatCardModule, MatButtonModule, AllFilesComponent],
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent {
  partner$: Observable<Company> | undefined;
  isLoading: boolean = true;
  isAdmin = false;
  partner: Company | undefined;

  private readonly auth: Auth = inject(Auth);
  private readonly partnerService: PartnerService = inject(PartnerService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly partnerStore: StoreService = inject(StoreService);

  constructor() {
    this.auth.onAuthStateChanged((state) => {
      this.isAdmin = state?.email?.endsWith('@' + environment.emailDomain) ?? false;
    });
  }

  get creationDate() {
    return this.partner?.creationDate?.toDate() ?? '';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.partnerService.get(id!).then((partner: Company) => {
      this.partnerStore.broadcastPartner(partner);
      this.partner = partner;
      this.isLoading = false;
    });
  }
}
