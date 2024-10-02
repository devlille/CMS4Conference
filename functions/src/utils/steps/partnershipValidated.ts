import PartnerhipValidatedFactory from "../../emails/template/step-2-partnership-validation";
import { sendEmailToAllContacts } from "../mail";

import { Company, Configuration } from "../../model";
import { StatusEnum } from "../document-change";

export default (
  company: Company,
  id: string,
  configuration: Configuration,
  shouldSendEmail: boolean
) => {
  if (shouldSendEmail) {
    sendEmailToAllContacts(
      company,
      PartnerhipValidatedFactory(company, id, configuration),
      configuration
    );
  }

  return {
    status: {
      ...company.status,
      validated: StatusEnum.DONE,
      generated: StatusEnum.PENDING,
    },
  };
};
