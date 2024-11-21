import { Injectable, inject } from '@angular/core';
import { Company, Configuration, ZodConfiguration } from '../model/company';
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

  private readonly firestore: Firestore = inject(Firestore);
  private readonly companiesCollection = collection(
    this.firestore,
    'companies-2025',
  );

  public add(company: Company) {
    return addDoc(this.companiesCollection, {
      ...company,
      status: {},
      email: this.convertEmailsToArray(company.email),
    });
  }

  public async get(id: string) {
    const data = await firstValueFrom(
      docData(doc(this.firestore, `companies-2025/${id}`)),
    );
    return { ...data, id } as Company;
  }

  public async getCurrentConfiguration() {
    const data = await firstValueFrom(
      docData(doc(this.firestore, 'editions/2025')),
    );

    const check = ZodConfiguration.safeParse(data);

    if (!check.success) {
      throw new Error(`Bad Configuration of your event`);
    }
    return data as Configuration;
  }

  public async updateVisibility(enabled: boolean) {
    return updateDoc(doc(this.firestore, 'editions/2025'), {
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

    if (fields.email) {
      return updateDoc(doc(this.firestore, `companies-2025/${id}`), {
        ...fields,
        email: this.convertEmailsToArray(fields.email),
      });
    }
    return updateDoc(doc(this.firestore, `companies-2025/${id}`), {
      ...fields,
    });
  }
}
