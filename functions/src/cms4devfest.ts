import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendEmail, sendEmailToAllContacts } from "./utils/mail";
import { StatusEnum, onDocumentChange } from "./utils/document-change";
import { DocumentData, Timestamp } from "@google-cloud/firestore";
import relanceConventionSignee from "./emails/template/relanceConventionSignee";

import WelcomeEmailFactory from "./emails/template/step-1-partnership-demand";
import relancePaiement from "./emails/template/relancePaiement";
import relanceInformationsComplementaires from "./emails/template/relanceInformationsComplementaires";
import { Settings } from "./model";

const firestore = admin.firestore();

function sendWelcomeEmail(company: DocumentData, id: string, settings: Settings) {
  const emailTemplate = WelcomeEmailFactory(company, id, settings);
  return sendEmailToAllContacts(company, emailTemplate, settings);
}

function addCreationDate(id: string) {
  return firestore
    .doc("companies-2024/" + id)
    .update({
      creationDate: Timestamp.fromDate(new Date()),
    })
    .catch((err) => console.log(err));
}

function updatesStatus(id: string, company: any, status: any) {
  return firestore
    .doc("companies-2024/" + id)
    .update({
      ...company,
      status,
    })
    .catch((err) => console.log(err));
}

const relance = (
  emailFactory: (partner: Record<string, any>, settings: Settings) => any,
  partners: any[],
  settings: Settings
) => {
  partners.forEach((c: any) => {
    const emailTemplate = emailFactory(c, settings);
    sendEmailToAllContacts(c, emailTemplate, settings);
  });
};
export const relancePartnaireConventionASigner = functions.https.onRequest(async (req, res) => {
  const data = await firestore.collection("companies-2024").get();
  const partners = data.docs.map((d) => d.data()).filter((p) => p.status.sign === StatusEnum.PENDING);
  relance(relanceConventionSignee, partners, functions.config() as Settings);
  res.send("ok");
});

export const relancePartnaireFacture = functions.https.onRequest(async (req, res) => {
  const data = await firestore.collection("companies-2024").get();
  const partners = data.docs.map((d) => d.data()).filter((p) => p.status.paid === StatusEnum.PENDING);
  relance(relancePaiement, partners, functions.config() as Settings);
  res.send("ok");
});

export const relanceInformationPourGeneration = functions.https.onRequest(async (req, res) => {
  const data = await firestore.collection("companies-2024").get();
  const partners = data.docs.map((d) => d.data()).filter((p) => p.status.generated === StatusEnum.PENDING);
  relance(relanceInformationsComplementaires, partners, functions.config() as Settings);
  res.send("ok");
});

export const newPartner = functions.firestore.document("companies-2024/{companyId}").onCreate(async (snap) => {
  const settings = functions.config() as Settings;
  const company = snap.data() || {};
  const id = snap.id;
  await addCreationDate(id);
  await sendWelcomeEmail(company, snap.id, settings);
  await sendEmail(
    settings.mail.to,
    "🎉 Nouveau Partenaire " + company.name,
    `
La société ${company.name} souhaite devenir partenaire ${company.sponsoring}<br>
`,
    settings
  );

  return updatesStatus(id, company, {
    filled: "done",
    validated: "pending",
  });
});

export const partnershipUpdated = functions.firestore.document("companies-2024/{companyId}").onUpdate((changes) => {
  const before = changes.before.data();
  const after = changes.after.data();
  if (!before || !after) {
    return;
  }
  const id = changes.after.id;

  return onDocumentChange(firestore, before, after, id, functions.config() as Settings);
});

exports.updateConventionSignedUrlProperty = functions.storage.object().onFinalize(async (object) => {
  const name = object.name || "";
  return admin
    .storage()
    .bucket()
    .file(name)
    .getSignedUrl({ action: "read", expires: "03-17-2025" })
    .then(([url]) => {
      return firestore.doc("companies-2024/" + name.replace("signed/", "")).update({
        conventionSignedUrl: url,
      });
    });
});
