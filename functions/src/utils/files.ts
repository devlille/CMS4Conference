import {
  generateConvention,
  generateProformaInvoice,
  generateInvoice,
  generateDevis,
  generateDepositInvoice,
} from "../generator/lib/generator";
import * as os from "os";
import * as admin from "firebase-admin";
import { DocumentData } from "@google-cloud/firestore";

export async function storeFile(cloudStorageDest: string, tempPath: string) {
  await admin
    .storage()
    .bucket()
    .upload(os.tmpdir() + "/" + tempPath, { destination: cloudStorageDest + tempPath });

  return await admin
    .storage()
    .bucket()
    .file(cloudStorageDest + tempPath)
    .getSignedUrl({ action: "read", expires: "03-17-2025" });
}
export async function generateAndStoreProformaInvoiceAndConvention(company: DocumentData, id: string, settings: any) {
  console.log("Generate Proforma invoice and convention for " + id);

  const [convention, proformaInvoice, depositInvoice, devis] = await Promise.all([
    generateConvention({ ...company, id }, settings),
    generateProformaInvoice({ ...company, id }, settings),
    generateDepositInvoice({ ...company, id }, settings),
    generateDevis({ ...company, id }, settings),
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
  company: DocumentData,
  id: string,
  settings: any
) {
  let invoiceNumber = company.invoiceNumber;

  if (!invoiceNumber) {
    invoiceNumber = await generateInvoiceNumber(firestore, id);
  }

  const invoice = await generateInvoice(
    {
      ...company,
      id,
      invoiceNumber,
    },
    settings
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

export async function generateInvoiceNumber(firestore: FirebaseFirestore.Firestore, id: string) {
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
