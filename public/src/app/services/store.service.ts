import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Company } from '../model/company';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private _partner = new BehaviorSubject<Company | null>(null);

  get partner$() {
    return this._partner.asObservable();
  }

  get partner() {
    return this._partner.getValue();
  }

  broadcastPartner(partner: Company) {
    this._partner.next(partner);
  }
}
