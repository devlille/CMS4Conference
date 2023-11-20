import {
  Component,
  ViewChild,
  inject,
  AfterViewInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, PartnerType, WorkflowStatus } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { Timestamp } from '@angular/fire/firestore';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

type FilterValueType = 'sign' | 'validated' | 'all';
type FilterByPackValueType =
  | 'Platinium'
  | 'Gold'
  | 'Silver'
  | 'Bronze'
  | 'Party'
  | 'all';
type FilterByTypeValueType = PartnerType | 'all';

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

  displayedColumns: string[] = [
    'creationDate',
    'name',
    'sponsoring',
    'secondSponsoring',
    'pending',
    'action',
  ];
  partners: Partial<Company>[] = [];
  filterByPack: { value: string; label: string }[] = [];
  filterByType: { value: string; label: string }[] = [];

  filterByStatus = [
    { value: 'validated', label: 'A valider' },
    { value: 'sign', label: 'En attente de signature' },
    { value: 'paid', label: 'En attente de paiement' },
    { value: 'received', label: 'En attente des éléments de communication' },
    { value: 'communicated', label: 'A lancer la communication' },
    { value: 'all', label: 'Tous' },
  ];

  originalPartners = signal<Partial<Company>[]>([]);
  filterValue = signal<FilterValueType>('all');
  filterByPackValue = signal<FilterByPackValueType>('all');
  filterByTypeValue = signal<FilterByTypeValueType>('all');
  dataSource = computed(() => {
    const pack = this.filterByPackValue();
    const type = this.filterByTypeValue();
    const filterValue = this.filterValue();

    const dataSource = new MatTableDataSource(
      this.originalPartners()
        .filter((partner) => pack === 'all' || partner.sponsoring === pack)
        .filter(
          (partner) =>
            filterValue === 'all' || partner.pending!.indexOf(filterValue) >= 0
        )
        .filter((partner) => {
          return (
            type === 'all' ||
            partner.type === type ||
            (!partner.type && type === 'other')
          );
        })
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
    partners.forEach((partner) => {
      if (partner.type === 'esn') {
        numberESN++;
      } else {
        numberOther++;
      }
    });

    this.filterByType = [
      { value: 'all', label: `Toutes (${numberESN + numberOther})` },
      { value: 'esn', label: `ESN (${numberESN})` },
      { value: 'other', label: `Autres (${numberOther})` },
    ];
  }

  archive(id: string) {
    this.partnerService.update(id, { archived: true });
  }

  filterByValue(filterValue: FilterValueType) {
    this.filterValue.set(filterValue);
  }

  ngAfterViewInit() {
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
        }))
      );
      this.countByPack(partners);
      this.countByType(partners);
    });
  }

  filterByPackHandler(pack: FilterByPackValueType) {
    this.filterByPackValue.set(pack);
  }

  filterByTypeHandler(type: FilterByTypeValueType) {
    this.filterByTypeValue.set(type);
  }

  copyEmails() {
    const emails = this.originalPartners()
      .reduce((acc: any, partner: any) => {
        return [...acc, partner.email];
      }, [])
      .flat()
      .join(';');
    navigator.clipboard.writeText(emails);
  }
}
