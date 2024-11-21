import WelcomeEmailFactory from '../../emails/template/step-1-partnership-demand';
import { Company, Configuration } from '../../model';
import { sendEmail, sendEmailToAllContacts } from '../../utils/mail';

export const sendWelcomeEmail = (company: Company, id: string, configuration: Configuration) => {
  const emailTemplate = WelcomeEmailFactory(company, id, configuration);
  return sendEmailToAllContacts(company, emailTemplate, configuration);
};

export const sendNewPartnerToOrganizationTeam = (company: Company, configuration: Configuration) => {
  return sendEmail(
    configuration.mail.to,
    '🎉 Nouveau Partenaire ' + company.name,
    `
  La société ${company.name} souhaite devenir partenaire ${company.sponsoring}<br>
  `,
    configuration
  );
};
