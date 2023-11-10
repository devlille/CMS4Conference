import { Component, ViewChild, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, WorkflowStatus } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { Timestamp } from '@angular/fire/firestore';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';

type FilterValueType = 'sign' | 'validated' | 'all';
type FilterByPackValueType =
  | 'Platinium'
  | 'Gold'
  | 'Silver'
  | 'Bronze'
  | 'Party'
  | 'all';
type filterByTypeValueType = 'esn' | 'other' | 'all';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<Partial<Company & { pending: string }>>;

  displayedColumns: string[] = [
    'creationDate',
    'name',
    'sponsoring',
    'secondSponsoring',
    'pending',
    'action',
  ];
  partners: Partial<Company>[] = [];
  originalPartners: Partial<Company>[] = [];
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
  filterValue: FilterValueType = 'all';

  filterByPackValue: FilterByPackValueType = 'all';
  filterByTypeValue: filterByTypeValueType = 'all';
  sortByValues: string[] = ['date', 'name'];

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
    this.filterValue = filterValue;
    this.sortAndFilter(
      this.originalPartners,
      this.filterValue,
      this.filterByPackValue,
      this.filterByTypeValue
    );
  }

  ngAfterViewInit() {
    this.partnerService.getAll().subscribe((partners) => {
      console.log(partners);
      this.originalPartners = partners.map((p) => ({
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
      }));
      this.countByPack(partners);
      this.countByType(partners);
      this.sortAndFilter(
        this.originalPartners,
        this.filterValue,
        this.filterByPackValue,
        this.filterByTypeValue
      );
      this.dataSource.sort = this.sort;
    });
  }

  private sortAndFilter(
    originalPartners: Array<Partial<Company & { pending: string }>>,
    filterValue: FilterValueType,
    pack: FilterByPackValueType,
    type: filterByTypeValueType
  ) {
    this.dataSource = new MatTableDataSource(
      originalPartners
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
    this.dataSource.sort = this.sort;
  }

  filterByPackHandler(pack: FilterByPackValueType) {
    this.filterByPackValue = pack;
    this.sortAndFilter(
      this.originalPartners,
      this.filterValue,
      this.filterByPackValue,
      this.filterByTypeValue
    );
  }

  filterByTypeHandler(type: filterByTypeValueType) {
    this.filterByTypeValue = type;
    console.log(this.filterByTypeValue);
    this.sortAndFilter(
      this.originalPartners,
      this.filterValue,
      this.filterByPackValue,
      this.filterByTypeValue
    );
  }

  copyEmails() {
    const emails = this.originalPartners
      .reduce((acc: any, partner: any) => {
        return [...acc, partner.email];
      }, [])
      .flat()
      .join(';');
    navigator.clipboard.writeText(emails);
  }
}
