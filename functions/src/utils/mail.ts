import { Company, Configuration, Email } from '../model';

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

export function sendEmailToAllContacts(company: Company, emailFactory: any, configuration: Configuration) {
  let emails = [configuration.mail.cc];
  if (configuration.mail.enabled === 'true') {
    emails = [...emails, ...company.email];
  }
  return Promise.all(
    emails.map((email: string) => {
      return sendEmail(email.trim(), `${emailFactory.subject} (${company.name})`, emailFactory.body, configuration);
    })
  );
}
export function sendEmail(to: string, subject: string, body: string, configuration: Configuration) {
  const mailjet = configuration.mailjet;
  const mailjetClient = require('node-mailjet').connect(mailjet.api, mailjet.private);
  const request = mailjetClient.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        ...getFrom(configuration.mail),
        To: [
          {
            Email: to
          }
        ],
        Subject: subject,
        HTMLPart: body,
        CustomID: 'AppGettingStartedTest'
      }
    ]
  });
  return request
    .then((result: { body: string }) => {
      console.log(result.body);
    })
    .catch((err: { statusCode: number }) => {
      console.log(err);
    });
}
