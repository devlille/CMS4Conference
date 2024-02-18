import PartnerhipValidatedFactory from "../../emails/template/step-2-partnership-validation";
import { sendEmailToAllContacts } from "../mail";

import { StatusEnum } from "../document-change";
import { Company, Settings } from "../../model";

export default (company: Company, id: string, settings: Settings, shouldSendEmail: boolean) => {
  if (shouldSendEmail) {
    sendEmailToAllContacts(company, PartnerhipValidatedFactory(company, id, settings), settings);
  }

  return {
    status: {
      ...company.status,
      validated: StatusEnum.DONE,
      generated: StatusEnum.PENDING,
    },
  };
};
