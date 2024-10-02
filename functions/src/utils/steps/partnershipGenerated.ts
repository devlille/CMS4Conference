import PartnerhipGeneratedFactory from "../../emails/template/step-partnership-generated";
import { sendEmailToAllContacts } from "../mail";

import { StatusEnum } from "../document-change";
import { Company, Configuration } from "../../model";

export default (
  company: Company,
  id: string,
  configuration: Configuration,
  shouldSendEmail: boolean
) => {
  if (shouldSendEmail) {
    sendEmailToAllContacts(
      company,
      PartnerhipGeneratedFactory(company, id, configuration),
      configuration
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
