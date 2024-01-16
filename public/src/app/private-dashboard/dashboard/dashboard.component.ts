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
import { HttpClientModule, HttpClient } from '@angular/common/http';

type FilterValueType =
  | 'sign'
  | 'generated'
  | 'validated'
  | 'paid'
  | 'received'
  | 'communicated';
type FilterByPackValueType =
  | 'Platinium'
  | 'Gold'
  | 'Silver'
  | 'Bronze'
  | 'Party'
  | 'Newsletter';
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
    HttpClientModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  configuration!: Configuration;
  displayedColumns: string[] = [
    'creationDate',
    'name',
    'sponsoring',
    'secondSponsoring',
    'action',
  ];
  partners: Partial<Company>[] = [];
  filterByPack: { value: FilterByPackValueType; label: string }[] = [];
  filterByStatus: { value: FilterValueType; label: string }[] = [];
  filterByType: { value: FilterByType; label: string }[] = [];

  originalPartners = signal<Partial<Company>[]>([]);
  filterByStatusValue = signal<FilterValueType[]>([
    'validated',
    'generated',
    'sign',
    'paid',
    'received',
    'communicated',
  ]);
  filterByPackValue = signal<FilterByPackValueType[]>([
    'Platinium',
    'Gold',
    'Silver',
    'Bronze',
    'Party',
    'Newsletter',
  ]);

  shouldDisplayRelanceButton = computed(() => {
    const status = this.filterByStatusValue();
    return (
      status.length === 1 &&
      ['generated', 'sign', 'paid'].indexOf(status[0]) >= 0
    );
  });
  filterByTypeValue = signal<FilterByType[]>(['esn', 'other', 'undefined']);
  dataSource = computed(() => {
    const packs = this.filterByPackValue();
    const types = this.filterByTypeValue();
    const filterValue = this.filterByStatusValue();

    const dataSource = new MatTableDataSource(
      this.originalPartners()
        .filter(
          (partner) =>
            packs.indexOf(partner.sponsoring! as FilterByPackValueType) >= 0,
        )
        .filter((partner) =>
          filterValue.find(
            (v) => !!partner.status && partner.status[v] === 'pending',
          ),
        )
        .filter((partner) => {
          return (
            types.indexOf(partner.type!) >= 0 ||
            (!partner.type && types.indexOf('undefined') >= 0)
          );
        }),
    );
    dataSource.sort = this.sort;

    return dataSource;
  });

  private readonly partnerService: PartnerService = inject(PartnerService);
  private readonly httpClient: HttpClient = inject(HttpClient);

  relance() {
    const status = this.filterByStatusValue();
    if (status[0] === 'generated') {
      return this.httpClient
        .get(
          'https://us-central1-cms4partners-ce427.cloudfunctions.net/relanceInformationPourGeneration',
        )
        .subscribe();
    } else if (status[0] === 'sign') {
      return this.httpClient
        .get(
          'https://us-central1-cms4partners-ce427.cloudfunctions.net/relancePartnaireConventionASigner',
        )
        .subscribe();
    } else if (status[0] === 'paid') {
      return this.httpClient
        .get(
          'https://us-central1-cms4partners-ce427.cloudfunctions.net/relancePartnaireFacture',
        )
        .subscribe();
    }

    return;
  }
  private countByPack(partners: Company[]) {
    let platiniumCount = 0;
    let goldCount = 0;
    let silverCount = 0;
    let bronzeCount = 0;
    let partyCount = 0;
    let newsletterCount = 0;

    partners.forEach((partner) => {
      if (partner.sponsoring === 'Platinium') {
        platiniumCount++;
      } else if (partner.sponsoring === 'Gold') {
        goldCount++;
      } else if (partner.sponsoring === 'Silver') {
        silverCount++;
      } else if (partner.sponsoring === 'Bronze') {
        bronzeCount++;
      } else if (partner.sponsoring === 'Party') {
        partyCount++;
      } else if (partner.sponsoring === 'Newsletter') {
        newsletterCount++;
      }
    });

    this.filterByPack = [
      { value: 'Platinium', label: `Platinium (${platiniumCount})` },
      { value: 'Gold', label: `Gold (${goldCount})` },
      { value: 'Silver', label: `Silver (${silverCount})` },
      { value: 'Bronze', label: `Bronze (${bronzeCount})` },
      { value: 'Party', label: `Party (${partyCount})` },
      { value: 'Newsletter', label: `Newsletter (${partyCount})` },
    ];
  }

  private countByType(partners: Company[]): void {
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

    this.filterByType = [
      { value: 'esn', label: `ESN (${numberESN})` },
      { value: 'other', label: `Autres (${numberOther})` },
      { value: 'undefined', label: `Non défini (${numberUndefined})` },
    ];
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
      .then((config) => (this.configuration = config));

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
      this.countByPack(partners);
      this.countByType(partners);
      this.countByStep(partners);
    });
  }
  countByStep(partners: Company[]) {
    const counter: { [key: string]: number } = {
      sign: 0,
      generated: 0,
      validated: 0,
      paid: 0,
      received: 0,
      communicated: 0,
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
    ];
  }

  filterByPackHandler(pack: FilterByPackValueType[]) {
    this.filterByPackValue.set(pack);
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
    return this.partnerService.updateVisibility(!this.configuration.enabled);
  }
}
