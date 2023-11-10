import { DocumentData, Timestamp } from "@google-cloud/firestore";
import PartnerhipValidatedFactory from "../../emails/template/step-2-partnership-validation";
import { sendEmailToAllContacts } from "../mail";
import { addDays } from "date-fns";

import { StatusEnum } from "../document-change";
export default (company: DocumentData, id: string, settings: any, shouldSendEmail: boolean) => {
  if (shouldSendEmail) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const date = addDays((company.creationDate as Timestamp).toDate(), 15);
    const dateTimeFormat = new Intl.DateTimeFormat("fr-FR", options as any);
    sendEmailToAllContacts(
      company,
      PartnerhipValidatedFactory(
        company,
        dateTimeFormat.format(date),
        `${settings.hosting.baseurl}/partner/${id}`,
        settings.convention.edition
      ),
      settings
    );
  }

  return {
    status: {
      ...company.status,
      validated: StatusEnum.DONE,
      sign: StatusEnum.PENDING,
    },
  };
};
