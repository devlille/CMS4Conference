import ConventionSignedFactory from "../emails/template/convention-signed";
import PaymentReceivedFactory from "../emails/template/step-3-payment-received";
import {
  generateAndStoreInvoice,
  generateAndStoreProformaInvoiceAndConvention,
} from "./files";
import { sendEmailToAllContacts } from "./mail";
import partnershipGenerated from "./steps/partnershipGenerated";
import partnershipValidated from "./steps/partnershipValidated";

import CommunicationScheduledFactory from "../emails/template/step-4-communcation-scheduled";
import BilletWebUrlFactory from "../emails/template/step-5-billet-web-url";
import { Company, Configuration } from "../model";
import decreasePacks from "./steps/decreasePacks";
import sendKoEmails from "./steps/sendKoEmails";
import { makeTicketStepAsDone } from "../v3/domain/updateStatus";

export enum StatusEnum {
  PENDING = "pending",
  DONE = "done",
  REFUSED = "refused",
  RETRY = "retry",
}

export async function onDocumentChange(
  firestore: FirebaseFirestore.Firestore,
  before: Company,
  after: Company,
  id: string,
  configuration: Configuration
) {
  const document = firestore.doc("companies-2025/" + id);
  console.log(
    `onDocumentChange ${id}: ${JSON.stringify(
      before.status
    )} -> ${JSON.stringify(after.status)}`
  );
  const status = after.status!;
  const beforeStatus = before.status!;
  if (status.generated === StatusEnum.PENDING) {
    if (
      !!after.address &&
      !!after.zipCode &&
      !!after.city &&
      !!after.siret &&
      !!after.representant &&
      !!after.role
    ) {
      return document.update({
        status: {
          ...status,
          generated: StatusEnum.DONE,
        },
      });
    }
  } else if (
    beforeStatus.generated !== status.generated &&
    ((status.generated === StatusEnum.DONE &&
      beforeStatus.generated !== StatusEnum.RETRY) ||
      status.generated === StatusEnum.RETRY)
  ) {
    await generateAndStoreProformaInvoiceAndConvention(
      after,
      id,
      configuration
    );
    await generateAndStoreInvoice(firestore, after, id, configuration);

    return document.update({
      ...partnershipGenerated(
        after,
        id,
        configuration,
        status.generated === StatusEnum.DONE
      ),
    });
  } else if (
    beforeStatus.validated !== status.validated &&
    status.validated === StatusEnum.DONE
  ) {
    const sponsoringType = after.sponsoring.toLowerCase();
    await decreasePacks(firestore, sponsoringType);

    return document.update({
      ...partnershipValidated(
        after,
        id,
        configuration,
        status.validated === StatusEnum.DONE
      ),
    });
  } else if (
    beforeStatus.validated !== status.validated &&
    status.validated === StatusEnum.REFUSED
  ) {
    sendKoEmails(after, configuration);
  } else if (
    beforeStatus.sign !== status.sign &&
    status.sign === StatusEnum.DONE
  ) {
    const emailTemplate = ConventionSignedFactory(id, configuration);
    sendEmailToAllContacts(after, emailTemplate, configuration);

    return document.update({
      status: {
        ...status,
        paid: StatusEnum.PENDING,
      },
    });
  } else if (
    beforeStatus.paid !== status.paid &&
    status.paid === StatusEnum.DONE
  ) {
    const emailTemplate = PaymentReceivedFactory(after, id, configuration);
    sendEmailToAllContacts(after, emailTemplate, configuration);
    return document.update({
      public: true,
      status: {
        ...status,
        received: StatusEnum.PENDING,
      },
    });
  } else if (
    status.received === StatusEnum.PENDING &&
    after.twitter &&
    after.linkedin !== ""
  ) {
    return document.update({
      status: {
        ...status,
        received: StatusEnum.DONE,
        communicated: StatusEnum.PENDING,
      },
    });
  } else if (
    (beforeStatus.communicated !== status.communicated &&
      status.communicated === StatusEnum.DONE) ||
    (status.communicated === StatusEnum.DONE &&
      before.publicationDate !== after.publicationDate)
  ) {
    if (!!after.publicationDate && (after.publicationDate as any) !== "") {
      const emailTemplate = CommunicationScheduledFactory(
        Intl.DateTimeFormat("fr").format(new Date(after.publicationDate)),
        configuration
      );
      sendEmailToAllContacts(after, emailTemplate, configuration);

      return document.update({
        status: {
          ...status,
          code: StatusEnum.PENDING,
        },
      });
    }
  } else if (
    status.code === StatusEnum.PENDING &&
    before.billetWebUrl !== after.billetWebUrl
  ) {
    const emailTemplate = BilletWebUrlFactory(after, configuration);
    sendEmailToAllContacts(after, emailTemplate, configuration);
  } else if (status.code === StatusEnum.PENDING) {
    const billetWebDone = after.billetWebDone;
    if (billetWebDone) {
      return document.update(makeTicketStepAsDone(status));
    }
  }

  return Promise.resolve();
}
