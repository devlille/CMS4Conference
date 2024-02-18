import {
  generateConvention,
  generateProformaInvoice,
  generateInvoice,
  generateDevis,
  generateDepositInvoice,
} from "../generator/lib/generator";
import * as os from "os";
import * as admin from "firebase-admin";
import { Company, Configuration, Settings } from "../model";

export async function storeFile(cloudStorageDest: string, tempPath: string) {
  await admin
    .storage()
    .bucket()
    .upload(os.tmpdir() + "/" + tempPath, {
      destination: cloudStorageDest + tempPath,
    });

  return await admin
    .storage()
    .bucket()
    .file(cloudStorageDest + tempPath)
    .getSignedUrl({ action: "read", expires: "03-17-2025" });
}
export async function generateAndStoreProformaInvoiceAndConvention(
  company: Company,
  id: string,
  settings: Settings,
  configurationFromFirestore: Configuration
) {
  console.log("Generate Proforma invoice and convention for " + id);

  const [convention, proformaInvoice, depositInvoice, devis] = await Promise.all([
    generateConvention({ ...company, id }, settings, configurationFromFirestore),
    generateProformaInvoice({ ...company, id }, settings, configurationFromFirestore),
    generateDepositInvoice({ ...company, id }, settings, configurationFromFirestore),
    generateDevis({ ...company, id }, settings, configurationFromFirestore),
  ]);

  await Promise.all([
    storeFile("convention/", convention as any),
    storeFile("devis/", proformaInvoice as any),
    storeFile("devis/", depositInvoice as any),
    storeFile("devis/", devis as any),
  ]);
}
export async function generateAndStoreInvoice(
  firestore: FirebaseFirestore.Firestore,
  company: Company,
  id: string,
  settings: any,
  configurationFromFirestore: Configuration
) {
  let invoiceNumber = company.invoiceNumber;

  if (!invoiceNumber) {
    invoiceNumber = await generateInvoiceNumber(firestore);
  }

  const invoice = await generateInvoice(
    {
      ...company,
      id,
      invoiceNumber,
    },
    settings,
    configurationFromFirestore
  );
  const publicInvoiceUrl = await storeFile("facture/", invoice as any);

  await firestore
    .doc("companies-2024/" + id)
    .update({
      invoiceUrl: publicInvoiceUrl,
      invoiceNumber,
    })
    .catch((err) => console.error(err));
}

export async function generateInvoiceNumber(firestore: FirebaseFirestore.Firestore) {
  console.log("Generate Invoice Number");
  const invoiceNumber = await firestore
    .doc("configuration/invoice_2024")
    .get()
    .then((invoice) => {
      return (invoice.data() as any).next_value;
    });

  const formattedNumber = "2024_" + invoiceNumber.padStart(3, "0");

  await firestore
    .doc("configuration/invoice_2024")
    .update({
      next_value: (parseInt(invoiceNumber, 10) + 1).toString(),
    })
    .catch((err) => console.error(err));

  return formattedNumber;
}
