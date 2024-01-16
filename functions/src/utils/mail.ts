import { DocumentData } from "@google-cloud/firestore";
import {Email, Settings} from "../model";

function getFrom(mail: Email) {
  return {
    From: {
      Email: mail.from,
      Name: mail.fromname,
    },
  };
}

export function sendEmailToAllContacts(company: DocumentData, emailFactory: any, settings: Settings) {
  if (settings.mail.enabled === "false") {
    return Promise.resolve();
  }
  return Promise.all(
    [...company.email, settings.mail.cc].map((email: string) => {
      return sendEmail(email.trim(), emailFactory.subject, emailFactory.body, settings);
    })
  );
}
export function sendEmail(to: string, subject: string, body: string, settings: Settings) {
  const mailjet = settings.mailjet;
  const mailjetClient = require("node-mailjet").connect(mailjet.api, mailjet.private);
  const request = mailjetClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        ...getFrom(settings.mail),
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        HTMLPart: body,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  return request
    .then((result: { body: string }) => {
      console.log(result.body);
    })
    .catch((err: { statusCode: number }) => {
      console.log(err);
    });
}
