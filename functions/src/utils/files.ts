import * as admin from 'firebase-admin';
import * as os from 'os';

import { generateConvention, generateProformaInvoice, generateInvoice, generateDevis, generateDepositInvoice } from '../generator/lib/generator';
import { Company, Configuration } from '../model';
import { getConfiguration } from '../v3/infrastructure/getConfiguration';

export async function storeFile(cloudStorageDest: string, tempPath: string) {
  await admin
    .storage()
    .bucket()
    .upload(os.tmpdir() + '/' + tempPath, {
      destination: cloudStorageDest + tempPath
    });

  return await admin
    .storage()
    .bucket()
    .file(cloudStorageDest + tempPath)
    .getSignedUrl({ action: 'read', expires: '03-17-2025' });
}
export async function generateAndStoreProformaInvoiceAndConvention(company: Company, id: string, configuration: Configuration) {
  console.log('Generate Proforma invoice and convention for ' + id);

  const [convention, proformaInvoice, depositInvoice, devis] = await Promise.all([
    generateConvention({ ...company, id }, configuration),
    generateProformaInvoice({ ...company, id }, configuration),
    generateDepositInvoice({ ...company, id }, configuration),
    generateDevis({ ...company, id }, configuration)
  ]);

  await Promise.all([storeFile('convention/', convention), storeFile('devis/', proformaInvoice), storeFile('devis/', depositInvoice), storeFile('devis/', devis)]);
}
export async function generateAndStoreInvoice(firestore: FirebaseFirestore.Firestore, company: Company, id: string, configuration: Configuration) {
  let invoiceNumber = company.invoiceNumber;

  if (!invoiceNumber) {
    invoiceNumber = await generateInvoiceNumber(firestore);
  }

  const invoice = await generateInvoice(
    {
      ...company,
      id,
      invoiceNumber
    },
    configuration
  );
  const publicInvoiceUrl = await storeFile('facture/', invoice as any);

  await firestore
    .doc('companies-2025/' + id)
    .update({
      invoiceUrl: publicInvoiceUrl,
      invoiceNumber
    })
    .catch((err) => console.error(err));
}

export async function generateInvoiceNumber(firestore: FirebaseFirestore.Firestore) {
  console.log('Generate Invoice Number');
  const invoiceNumber = await getConfiguration(firestore).then((invoice) => {
    return invoice.next_value;
  });

  const formattedNumber = '2025_' + invoiceNumber.padStart(3, '0');

  await firestore
    .doc('editions/2025')
    .update({
      next_value: (parseInt(invoiceNumber, 10) + 1).toString()
    })
    .catch((err) => console.error(err));

  return formattedNumber;
}
