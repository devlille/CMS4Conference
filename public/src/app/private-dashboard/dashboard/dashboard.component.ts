import {
  Component,
  ViewChild,
  inject,
  AfterViewInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, Configuration, PartnerType } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { Timestamp } from '@angular/fire/firestore';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {} from '@angular/common/http';
import { Functions, httpsCallable } from '@angular/fire/functions';

type FilterValueType =
  | 'sign'
  | 'generated'
  | 'validated'
  | 'paid'
  | 'received'
  | 'communicated'
  | 'code';
type FilterByPackValueType = string;
type FilterByType = PartnerType | 'undefined';

@Component({
  selector: 'cms-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    MatTableModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSortModule,
    MatButtonToggleModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  configuration = signal<Configuration | undefined>(undefined);
  displayedColumns: string[] = [
    'creationDate',
    'name',
    'sponsoring',
    'secondSponsoring',
    'action',
  ];
  partners: Partial<Company>[] = [];
  filterByStatus: { value: FilterValueType; label: string }[] = [];

  originalPartners = signal<Partial<Company>[]>([]);
  filterByStatusValue = signal<FilterValueType[]>([
    'validated',
    'generated',
    'sign',
    'paid',
    'received',
    'communicated',
    'code',
  ]);

  shouldDisplayRelanceButton = computed(() => {
    const status = this.filterByStatusValue();
    return (
      status.length === 1 &&
      ['generated', 'sign', 'paid'].indexOf(status[0]) >= 0
    );
  });
  filterByTypeValue = signal<FilterByType[]>(['esn', 'other', 'undefined']);

  filteredPartnersByStatus = computed(() => {
    const status = this.filterByStatusValue();
    return this.originalPartners().filter((partner) =>
      status.find((v) => !!partner.status && partner.status[v] === 'pending'),
    );
  });

  filteredPartnersByStatusAndPacks = computed(() => {
    const packs = this.filterByPackValue();

    return this.filteredPartnersByStatus().filter(
      (partner) =>
        packs.indexOf(
          partner.sponsoring?.toLowerCase()! as FilterByPackValueType,
        ) >= 0,
    );
  });

  filteredPartners = computed(() => {
    const types = this.filterByTypeValue();

    return this.filteredPartnersByStatusAndPacks().filter((partner) => {
      return (
        types.indexOf(partner.type!) >= 0 ||
        (!partner.type && types.indexOf('undefined') >= 0)
      );
    });
  });

  dataSource = computed(() => {
    const dataSource = new MatTableDataSource(this.filteredPartners());
    dataSource.sort = this.sort;

    return dataSource;
  });

  packOptions = computed(() => {
    const partners = this.filteredPartnersByStatus();
    const configuration = this.configuration();

    const stats = partners.reduce(
      (acc: Record<string, number>, partner: Partial<Company>) => {
        const count: number = acc[partner.sponsoring!.toLocaleLowerCase()] ?? 0;
        return {
          ...acc,
          [partner.sponsoring!.toLocaleLowerCase()]: count + 1,
        };
      },
      {
        ...configuration?.sponsorships.reduce(
          (acc, sponsorship) => ({ ...acc, [sponsorship.name]: 0 }),
          {},
        ),
      },
    );

    return Object.entries(stats).map(([key, count]: [string, number]) => ({
      value: key,
      label: `${key} (${count})`,
    }));
  });

  filterByPackValue = computed(() => {
    const options = this.packOptions();
    const filterByPackSelected = this.filterByPackSelected();
    const values = options.map((option) => option.value);

    if (!filterByPackSelected) {
      return values;
    }
    return values.filter((value) => filterByPackSelected.includes(value));
  });
  filterByPackSelected = signal<FilterByPackValueType[] | undefined>(undefined);

  filterByPackHandler(pack: FilterByPackValueType[]) {
    this.filterByPackSelected.set(pack);
  }

  filterByType = computed(() => {
    const partners = this.filteredPartnersByStatusAndPacks();

    let numberESN = 0;
    let numberOther = 0;
    let numberUndefined = 0;
    partners.forEach((partner) => {
      if (partner.type === 'esn') {
        numberESN++;
      } else if (partner.type === 'other') {
        numberOther++;
      } else {
        numberUndefined++;
      }
    });

    return [
      { value: 'esn', label: `ESN (${numberESN})` },
      { value: 'other', label: `Autres (${numberOther})` },
      { value: 'undefined', label: `Non défini (${numberUndefined})` },
    ];
  });

  private readonly partnerService: PartnerService = inject(PartnerService);
  private readonly functions: Functions = inject(Functions);

  async relance() {
    const status = this.filterByStatusValue();
    if (status[0] === 'generated') {
      await httpsCallable(
        this.functions,
        'cms-relanceInformationPourGeneration',
      )();
    } else if (status[0] === 'sign') {
      await httpsCallable(
        this.functions,
        'cms-relancePartnaireConventionASigner',
      )();
    } else if (status[0] === 'paid') {
      await httpsCallable(this.functions, 'cms-relancePartnaireFacture')();
    }

    return;
  }

  archive(id: string) {
    this.partnerService.update(id, { archived: true });
  }

  filterByValue(filterValue: FilterValueType[]) {
    this.filterByStatusValue.set(filterValue);
  }

  ngAfterViewInit() {
    this.partnerService
      .getCurrentConfiguration()
      .then((config) => this.configuration.set(config));

    this.partnerService.getAll().subscribe((partners) => {
      this.originalPartners.set(
        partners.map((partners) => ({
          ...partners,
          formattedDate: partners.creationDate
            ? new Intl.DateTimeFormat('fr', {
                dateStyle: 'full',
                timeStyle: 'long',
              } as any).format((partners.creationDate as Timestamp).toDate())
            : '',
          needAction:
            (!!partners.conventionSignedUrl &&
              partners.status!.sign === 'pending') ||
            (partners.status!.generated === 'pending' && !!partners.address),
        })),
      );
      this.countByStep(partners);
    });
  }
  countByStep(partners: Company[]) {
    const counter: Record<string, number> = {
      sign: 0,
      generated: 0,
      validated: 0,
      paid: 0,
      received: 0,
      communicated: 0,
      code: 0,
    };

    partners.forEach((partner) => {
      Object.entries(partner.status ?? {}).forEach(([step, status]) => {
        if (status === 'pending') {
          counter[step] += 1;
        }
      });
    });

    this.filterByStatus = [
      { value: 'validated', label: `Valider (${counter['validated']})` },
      {
        value: 'generated',
        label: `Informations complémentaires (${counter['generated']})`,
      },
      { value: 'sign', label: `Signature (${counter['sign']})` },
      { value: 'paid', label: `Paiement (${counter['paid']})` },
      {
        value: 'received',
        label: `Eléments de communication (${counter['received']})`,
      },
      {
        value: 'communicated',
        label: `Communication (${counter['communicated']})`,
      },
      {
        value: 'code',
        label: `Code (${counter['code']})`,
      },
    ];
  }

  filterByStatusValueHandler(values: FilterValueType[]) {
    this.filterByStatusValue.set(values);
  }

  filterByTypeHandler(type: FilterByType[]) {
    this.filterByTypeValue.set(type);
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
