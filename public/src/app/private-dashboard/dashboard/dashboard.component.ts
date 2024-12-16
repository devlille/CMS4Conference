import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, effect, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Timestamp } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { Company, Configuration, WorkflowStatus } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { DashboardFilterComponent, Search } from './dashboard-filter.component';

const DefaultSearchValue = {
  status: ['sign', 'generated', 'validated', 'paid', 'received', 'communicated', 'code'],
  packs: ['bronze', 'silver', 'gold', 'party'],
  types: ['esn', 'other', 'undefined']
};

@Component({
  selector: 'cms-dashboard',
  imports: [
    DashboardFilterComponent,
    MatCheckboxModule,
    MatExpansionModule,
    CommonModule,
    MatRadioModule,
    MatTableModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSortModule,
    MatButtonToggleModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  private readonly partnerService: PartnerService = inject(PartnerService);
  private readonly functions: Functions = inject(Functions);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly queryParameters = toSignal(this.route.queryParams);

  value = linkedSignal<Search>(() => {
    const queryParameterValues = this.queryParameters();
    if (queryParameterValues && Object.keys(queryParameterValues).length > 0) {
      return {
        status: queryParameterValues['status']?.split(',') ?? [],
        packs: queryParameterValues['packs']?.split(',') ?? [],
        types: queryParameterValues['types']?.split(',') ?? []
      };
    }
    return DefaultSearchValue;
  });

  syncParams = effect(() => {
    this.router.navigate([], {
      queryParams: {
        status: this.value().status?.join(','),
        packs: this.value().packs?.join(','),
        types: this.value().types?.join(',')
      },
      queryParamsHandling: 'merge'
    });
  });
  readonly sort = viewChild.required(MatSort);

  onFilterChange = (search: Search) => {
    this.value.set(search);
  };

  configuration = signal<Configuration | undefined>(undefined);
  displayedColumns: string[] = ['creationDate', 'name', 'sponsoring', 'secondSponsoring', 'action'];
  partners: Partial<Company>[] = [];

  originalPartners = signal<Partial<Company>[]>([]);

  shouldDisplayRelanceButton = linkedSignal(() => {
    const status = this.value().status;
    return status.length === 1 && ['generated', 'sign', 'paid'].indexOf(status[0]) >= 0;
  });

  filteredPartners = computed(() => {
    const partners = this.originalPartners();

    const filteredByStatus = partners.filter((p) => this.value().status.find((s: any) => p.status?.[s as unknown as keyof WorkflowStatus] === 'pending'));
    const filteredByPack = filteredByStatus.filter((p) => this.value().packs.includes(p.sponsoring!));
    const filterByType = filteredByPack.filter((p) => {
      return this.value().types.includes(p.type!) || (this.value().types.includes('undefined') && !p.type);
    });
    return filterByType;
  });

  dataSource = linkedSignal(() => {
    const dataSource = new MatTableDataSource(this.filteredPartners());
    dataSource.sort = this.sort();
    return dataSource;
  });

  async relance() {
    const status = this.value().status;
    if (status[0] === 'generated') {
      await httpsCallable(this.functions, 'cms-relanceInformationPourGeneration')();
    } else if (status[0] === 'sign') {
      await httpsCallable(this.functions, 'cms-relancePartnaireConventionASigner')();
    } else if (status[0] === 'paid') {
      await httpsCallable(this.functions, 'cms-relancePartnaireFacture')();
    }

    return;
  }

  archive(id: string) {
    this.partnerService.update(id, { archived: true });
  }

  ngAfterViewInit() {
    this.partnerService.getCurrentConfiguration().then((config) => {
      this.configuration.set(config);
    });

    this.partnerService.getAll().subscribe((partners) => {
      this.originalPartners.set(
        partners.map((partners) => ({
          ...partners,
          formattedDate: partners.creationDate
            ? new Intl.DateTimeFormat('fr', {
                dateStyle: 'full',
                timeStyle: 'long'
              } as any).format((partners.creationDate as Timestamp).toDate())
            : '',
          needAction: (!!partners.conventionSignedUrl && partners.status!.sign === 'pending') || (partners.status!.generated === 'pending' && !!partners.address)
        }))
      );
    });
  }

  copyEmails() {
    const emails = this.dataSource()
      .filteredData.reduce((acc: any, partner: any) => {
        return [...acc, partner.email];
      }, [])
      .flat()
      .join(';');
    navigator.clipboard.writeText(emails);
  }

  changeVisibility() {
    return this.partnerService.updateVisibility(!this.configuration()!.enabled);
  }
}
