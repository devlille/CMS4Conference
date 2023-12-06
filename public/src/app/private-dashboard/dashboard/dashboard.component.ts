import {
  Component,
  ViewChild,
  inject,
  AfterViewInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, Configuration, PartnerType, WorkflowStatus } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { Timestamp } from '@angular/fire/firestore';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

type FilterValueType =
  | 'sign'
  | 'generated'
  | 'validated'
  | 'paid'
  | 'received'
  | 'communicated'
  | 'all';
type FilterByPackValueType =
  | 'Platinium'
  | 'Gold'
  | 'Silver'
  | 'Bronze'
  | 'Party'
  | 'all';
type FilterByType = PartnerType | 'all' | 'undefined';

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

  configuration!: Configuration;
  displayedColumns: string[] = [
    'creationDate',
    'name',
    'sponsoring',
    'secondSponsoring',
    'pending',
    'action',
  ];
  partners: Partial<Company>[] = [];
  filterByPack: { value: FilterByPackValueType; label: string }[] = [];
  filterByStatus: { value: FilterValueType; label: string }[] = [];
  filterByType: { value: FilterByType; label: string }[] = [];


  originalPartners = signal<Partial<Company>[]>([]);
  filterValue = signal<FilterValueType>('all');
  filterByStatusValue = signal<FilterValueType>('all');
  filterByPackValue = signal<FilterByPackValueType>('all');
  filterByTypeValue = signal<FilterByType>('all');
  dataSource = computed(() => {
    const pack = this.filterByPackValue();
    const type = this.filterByTypeValue();
    const filterValue = this.filterByStatusValue();

    const dataSource = new MatTableDataSource(
      this.originalPartners()
        .filter((partner) => pack === 'all' || partner.sponsoring === pack)
        .filter(
          (partner) =>
            filterValue === 'all' || partner.pending!.indexOf(filterValue) >= 0,
        )
        .filter((partner) => {
          return (
            type === 'all' ||
            partner.type === type ||
            (!partner.type && type === 'undefined')
          );
        }),
    );
    dataSource.sort = this.sort;

    return dataSource;
  });

  private readonly partnerService: PartnerService = inject(PartnerService);

  private getPendingStatus(status: WorkflowStatus | undefined) {
    if (!status) {
      return '';
    }
    return Object.entries(status)
      .filter(([key, value]) => value === 'pending')
      .map(([key, value]) => key)
      .join(',');
  }

  private countByPack(partners: Company[]) {
    let platiniumCount = 0;
    let goldCount = 0;
    let silverCount = 0;
    let bronzeCount = 0;
    let partyCount = 0;

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
      }
    });

    this.filterByPack = [
      { value: 'Platinium', label: `Platinium (${platiniumCount})` },
      { value: 'Gold', label: `Gold (${goldCount})` },
      { value: 'Silver', label: `Silver (${silverCount})` },
      { value: 'Bronze', label: `Bronze (${bronzeCount})` },
      { value: 'Party', label: `Party (${partyCount})` },
    ];
  }

  private countByType(partners: Company[]): void {
    let numberESN = 0;
    let numberOther = 0;
    let numberUndefined = 0;
    partners.forEach((partner) => {
      if (partner.type === 'esn') {
        numberESN++;
      } else if(partner.type === 'other') {
        numberOther++;
      } else {
        numberUndefined++
      }
    });

    this.filterByType = [
      { value: 'all', label: `Toutes (${numberESN + numberOther})` },
      { value: 'esn', label: `ESN (${numberESN})` },
      { value: 'other', label: `Autres (${numberOther})` },
      { value: 'undefined', label: `Non défini (${numberUndefined})` },
    ];
  }

  archive(id: string) {
    this.partnerService.update(id, { archived: true });
  }

  filterByValue(filterValue: FilterValueType) {
    this.filterValue.set(filterValue);
  }

  ngAfterViewInit() {
    this.partnerService.getCurrentConfiguration().then(config => this.configuration = config);

    this.partnerService.getAll().subscribe((partners) => {
      this.originalPartners.set(
        partners.map((p) => ({
          email: p.email,
          id: p.id,
          name: p.name,
          sponsoring: p.sponsoring,
          secondSponsoring: p.secondSponsoring,
          creationDate: p.creationDate,
          formattedDate: new Intl.DateTimeFormat('fr', {
            dateStyle: 'full',
            timeStyle: 'long',
          } as any).format((p.creationDate as Timestamp).toDate()),
          pending: this.getPendingStatus(p.status),
          type: p.type,
          needAction: !!p.conventionSignedUrl && p.status!.sign === 'pending',
        })),
      );
      this.countByPack(partners);
      this.countByType(partners);
      this.countByStep(partners)
    });
  }
  countByStep(partners: Company[]) {
    const counter: { [key: string ]: number} = {
      'sign': 0,
      'generated': 0,
      'validated': 0,
      'paid': 0,
      'received': 0,
      'communicated': 0
    }

    partners.forEach(partner => {
      Object.entries(partner.status ?? {}).forEach(([ step, status]) => {
        console.log({ step, status })
        if(status === 'pending'){
          counter[step] += 1
        }
      })
    })

    this.filterByStatus = [
      { value: 'validated', label: `Valider (${counter['validated']})` },
      { value: 'generated', label: `Informations complémentaires (${counter['generated']})` },
      { value: 'sign', label: `Signature (${counter['sign']})` },
      { value: 'paid', label: `Paiement (${counter['paid']})` },
      { value: 'received', label: `Eléments de communication (${counter['received']})` },
      { value: 'communicated', label: `Communication (${counter['communicated']})` },
    ]
  }

  filterByPackHandler(pack: FilterByPackValueType) {
    this.filterByPackValue.set(pack);
  }

  ffilterByStatusValueHandler(value: FilterValueType) {
    this.filterByStatusValue.set(value);
  }

  filterByTypeHandler(type: FilterByType) {
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

  changeVisibility(){
    return this.partnerService.updateVisibility(!this.configuration.enabled)
  }
}
