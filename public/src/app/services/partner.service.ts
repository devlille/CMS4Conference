import { Injectable, inject } from '@angular/core';
import { Company, Configuration } from '../model/company';
import {
  Firestore,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  collectionSnapshots,
  doc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  Observable,
  Subject,
  firstValueFrom,
  map,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  updateFlag: Subject<boolean> = new BehaviorSubject(true);

  private firestore: Firestore = inject(Firestore);
  private companiesCollection = collection(this.firestore, 'companies-2024');

  public add(company: Company) {
    return addDoc(this.companiesCollection, {
      ...company,
      status: {},
      email: this.convertEmailsToArray(company.email),
    });
  }

  public async get(id: string) {
    const data = await firstValueFrom(
      docData(doc(this.firestore, `companies-2024/${id}`)),
    );
    return { ...data, id } as Company;
  }

  public async getCurrentConfiguration() {
    const data = await firstValueFrom(
      docData(doc(this.firestore, 'configuration/invoice_2024')),
    );
    return data as Configuration;
  }

  public async updateVisibility(enabled: boolean) {
    return updateDoc(doc(this.firestore, 'configuration/invoice_2024'), {
      enabled,
    });
  }

  private convertEmailsToArray(emails: string | string[]): string[] {
    return Array.isArray(emails)
      ? emails
      : emails.split(',').map((e) => e.trim());
  }

  public getAll(): Observable<Company[]> {
    return collectionSnapshots(this.companiesCollection).pipe(
      map((snapshots: QueryDocumentSnapshot[]) => {
        return snapshots
          .map(
            (snapshot) => ({ ...snapshot.data(), id: snapshot.id }) as Company,
          )
          .filter(
            (company) =>
              !company.archived && company.status?.validated !== 'refused',
          );
      }),
    );
  }

  public update(id: string, fields: Partial<Company>) {
    this.updateFlag.next(true);

    if (!!fields.email) {
      return updateDoc(doc(this.firestore, `companies-2024/${id}`), {
        ...fields,
        email: this.convertEmailsToArray(fields.email),
      });
    }
    return updateDoc(doc(this.firestore, `companies-2024/${id}`), {
      ...fields,
    });
  }
}
