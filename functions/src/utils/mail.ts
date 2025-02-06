import axios from 'axios';

import type { Company, Configuration, Email, EmailContent } from '../model';

export function getFrom(mail: Email): {
  From: { Email: string; Name: string };
} {
  return {
    From: {
      Email: mail.from,
      Name: mail.fromname
    }
  };
}

export function sendEmailToAllContacts(company: Company, emailFactory: EmailContent, configuration: Configuration) {
  const emails = Array.isArray(company.email) ? company.email : [company.email];

  return sendEmail(
    emails.map((m) => m.trim()),
    `${emailFactory.subject} (${company.name})`,
    emailFactory.body,
    configuration
  );
}
export function sendEmail(to: string[], subject: string, body: string, configuration: Configuration) {
  return axios
    .post('https://hook.eu2.make.com/kdsvi4rcd8hzdphroyif3ch9udw33xke', {
      from: configuration.mail.from,
      to: to,
      cc: configuration.mail.cc,
      subject: subject,
      text: body
    })
    .then(() => console.log('Email Send'))
    .catch((err: string) => console.log(err));
}
