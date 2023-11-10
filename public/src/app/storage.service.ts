import { Injectable, inject } from '@angular/core';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage = inject(Storage);

  private getFile(path: string) {
    return getDownloadURL(ref(this.storage, path));
  }

  public getFlyers(id: string) {
    return this.getFile('flyers/' + id);
  }

  public getInvoice(id: string) {
    return this.getFile('facture/invoice_' + id + '.pdf');
  }

  public getSignedConvention(id: string) {
    return this.getFile('conventionSigned/' + id + '.pdf');
  }

  public getDepositInvoice(id: string) {
    return this.getFile('devis/deposit_invoice_' + id + '.pdf');
  }

  public getConvention(id: string) {
    return this.getFile('convention/convention_' + id + '.pdf');
  }

  public getProformaInvoice(id: string) {
    return this.getFile('devis/proforma_invoice_' + id + '.pdf');
  }

  public getDevis(id: string) {
    return this.getFile('devis/devis_' + id + '.pdf');
  }

  public uploadConvention(id: string, file: Blob) {
    return this.uploadFile(`convention_${id}`, file, 'convention');
  }

  public uploadDevis(id: string, file: Blob) {
    return this.uploadFile(`devis_${id}`, file, 'devis');
  }

  public uploadSignedConvention(id: string, file: Blob) {
    return this.uploadFile(`devis_${id}`, file, 'conventionSigned');
  }

  public uploadInvoice(id: string, file: Blob) {
    return this.uploadFile(`invoice_${id}`, file, 'facture');
  }

  public uploadFile(
    name: string,
    file: Blob,
    bucket = 'logo'
  ): Promise<string> {
    const storageRef = ref(this.storage, `${bucket}/${name}.pdf`);
    return uploadBytes(storageRef, file).then((snapshot) =>
      getDownloadURL(snapshot.ref)
    ) as Promise<string>;
  }
}
