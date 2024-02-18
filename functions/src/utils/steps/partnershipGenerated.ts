import PartnerhipGeneratedFactory from "../../emails/template/step-partnership-generated";
import { sendEmailToAllContacts } from "../mail";

import { StatusEnum } from "../document-change";
import { Company, Settings } from "../../model";
export default (company: Company, id: string, settings: Settings, shouldSendEmail: boolean) => {
  if (shouldSendEmail) {
    sendEmailToAllContacts(company, PartnerhipGeneratedFactory(company, id, settings), settings);
  }

  return {
    status: {
      ...company.status,
      generated: StatusEnum.DONE,
      sign: StatusEnum.PENDING,
    },
  };
};
