import { DocumentData, Timestamp } from "@google-cloud/firestore";
import PartnerhipGeneratedFactory from "../../emails/template/step-partnership-generated";
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
      PartnerhipGeneratedFactory(
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
      generated: StatusEnum.DONE,
      sign: StatusEnum.PENDING,
    },
  };
};
