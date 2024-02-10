import { DocumentData } from "@google-cloud/firestore";
import partnershipValidated from "./steps/partnershipValidated";
import partnershipGenerated from "./steps/partnershipGenerated";
import { sendEmailToAllContacts } from "./mail";
import { generateAndStoreInvoice, generateAndStoreProformaInvoiceAndConvention } from "./files";
import PaymentReceivedFactory from "../emails/template/step-3-payment-received";
import ConventionSignedFactory from "../emails/template/convention-signed";

import CommunicationScheduledFactory from "../emails/template/step-4-communcation-scheduled";
import BilletWebUrlFactory from "../emails/template/step-5-billet-web-url";
import decreasePacks from "./steps/decreasePacks";
import sendKoEmails from "./steps/sendKoEmails";
import { Settings } from "../model";

export enum StatusEnum {
  PENDING = "pending",
  DONE = "done",
  REFUSED = "refused",
  RETRY = "retry",
}

export async function onDocumentChange(
  firestore: FirebaseFirestore.Firestore,
  before: DocumentData,
  after: DocumentData,
  id: string,
  settings: Settings
) {
  console.log(`onDocumentChange ${id}: ${JSON.stringify(before.status)} -> ${JSON.stringify(after.status)}`);
  const status = after.status;
  if (status.generated === StatusEnum.PENDING) {
    if (!!after.address && !!after.zipCode && !!after.city && !!after.siret && !!after.representant && !!after.role) {
      return firestore.doc("companies-2024/" + id).update({
        status: {
          ...status,
          generated: StatusEnum.DONE,
        },
      });
    }
  } else if (
    before.status.generated !== status.generated &&
    ((status.generated === StatusEnum.DONE && before.status.generated !== StatusEnum.RETRY) ||
      status.generated === StatusEnum.RETRY)
  ) {
    const configurationFromFirestore = await firestore
      .doc("configuration/invoice_2024")
      .get()
      .then((invoice) => {
        return invoice.data() as any;
      });

    await generateAndStoreProformaInvoiceAndConvention(after, id, settings, configurationFromFirestore);
    await generateAndStoreInvoice(firestore, after, id, settings, configurationFromFirestore);

    return firestore.doc("companies-2024/" + id).update({
      ...partnershipGenerated(after, id, settings, status.generated === StatusEnum.DONE),
    });
  } else if (before.status.validated !== status.validated && status.validated === StatusEnum.DONE) {
    const sponsoringType = after.sponsoring.toLowerCase();
    await decreasePacks(firestore, sponsoringType);

    return firestore.doc("companies-2024/" + id).update({
      ...partnershipValidated(after, id, settings, status.validated === StatusEnum.DONE),
    });
  } else if (before.status.validated !== status.validated && status.validated === StatusEnum.REFUSED) {
    await sendKoEmails(after, settings);
  } else if (before.status.sign !== status.sign && status.sign === StatusEnum.DONE) {
    const emailTemplate = ConventionSignedFactory(id, settings);
    sendEmailToAllContacts(after, emailTemplate, settings);

    return firestore.doc("companies-2024/" + id).update({
      status: {
        ...status,
        paid: StatusEnum.PENDING,
      },
    });
  } else if (before.status.paid !== status.paid && status.paid === StatusEnum.DONE) {
    const emailTemplate = PaymentReceivedFactory(after, id, settings);
    sendEmailToAllContacts(after, emailTemplate, settings);
    return firestore.doc("companies-2024/" + id).update({
      public: true,
      status: {
        ...status,
        received: StatusEnum.PENDING,
        code: StatusEnum.PENDING,
      },
    });
  } else if (status.received === StatusEnum.PENDING && after.twitter && after.linkedin !== "") {
    return firestore.doc("companies-2024/" + id).update({
      status: {
        ...status,
        received: StatusEnum.DONE,
        communicated: StatusEnum.PENDING,
      },
    });
  } else if (
    (before.status.communicated !== status.communicated && status.communicated === StatusEnum.DONE) ||
    (status.communicated === StatusEnum.DONE && before.publicationDate !== after.publicationDate)
  ) {
    if (!!after.publicationDate && after.publicationDate !== "") {
      const emailTemplate = CommunicationScheduledFactory(
        Intl.DateTimeFormat("fr").format(new Date(after.publicationDate)),
        settings
      );
      sendEmailToAllContacts(after, emailTemplate, settings);
    }
  } else if (status.code === StatusEnum.PENDING && before.billetWebUrl !== after.billetWebUrl) {
    const emailTemplate = BilletWebUrlFactory(after, settings);
    sendEmailToAllContacts(after, emailTemplate, settings);
  } else if (status.code === StatusEnum.PENDING) {
    const billetWebDone = after.billetWebDone;
    if (billetWebDone) {
      return firestore.doc("companies-2024/" + id).update({
        status: {
          ...status,
          code: StatusEnum.DONE,
        },
      });
    }
  }

  return Promise.resolve();
}
