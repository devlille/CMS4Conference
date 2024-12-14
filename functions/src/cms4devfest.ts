import { Timestamp } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import relanceConventionSignee from './emails/template/relanceConventionSignee';
import relanceInformationsComplementaires from './emails/template/relanceInformationsComplementaires';
import relancePaiement from './emails/template/relancePaiement';
import type { Company, Configuration, EmailContent, WorkflowStatus } from './model';
import { StatusEnum, onDocumentChange } from './utils/document-change';
import { sendEmail, sendEmailToAllContacts } from './utils/mail';
import { sendNewPartnerToOrganizationTeam, sendWelcomeEmail } from './v3/domain/email';
import { getConfiguration } from './v3/infrastructure/getConfiguration';

admin.initializeApp();
const firestore = admin.firestore();

function addCreationDate(id: string) {
  return firestore
    .doc('companies-2025/' + id)
    .update({
      creationDate: Timestamp.fromDate(new Date())
    })
    .catch((err) => console.log(err));
}

function updatesStatus(id: string, company: Company, status: WorkflowStatus) {
  return firestore
    .doc('companies-2025/' + id)
    .update({
      ...company,
      status
    })
    .catch((err) => console.log(err));
}

export const getAllPublicSponsors = functions.https.onRequest(async (req, resp) => {
  const edition = req.query.edition;
  const data = await firestore.collection('companies-' + edition).get();
  const partners = data.docs
    .map((d) => ({
      id: d.id,
      ...d.data()
    }))
    .filter((p: any) => p.status.paid === StatusEnum.DONE && p.public && !!p.siteUrl && !!p.logoUrl);
  resp.send(partners);
});

export const testEmail = functions.https.onRequest(async (req, resp) => {
  const configuration = await getConfiguration(firestore);
  await sendEmail(['demey.emmanuel@gmail.com'], 'subject', 'body', configuration);
  resp.send(1);
});

const relance = (emailFactory: (partner: Company, configuration: Configuration) => EmailContent, partners: Company[], configuration: Configuration) => {
  partners.forEach((c: Company) => {
    const emailTemplate = emailFactory(c, configuration);
    sendEmailToAllContacts(c, emailTemplate, configuration);
  });
};

export const relancePartnaireConventionASigner = functions.https.onCall(async () => {
  const configuration = await getConfiguration(firestore);
  const data = await firestore.collection('companies-2025').get();
  const partners = data.docs.map((d) => d.data()).filter((p) => p.status.sign === StatusEnum.PENDING);
  relance(relanceConventionSignee, partners, configuration);
});

export const relancePartnaireFacture = functions.https.onCall(async () => {
  const configuration = await getConfiguration(firestore);
  const data = await firestore.collection('companies-2025').get();
  const partners = data.docs.map((d) => d.data()).filter((p) => p.status.paid === StatusEnum.PENDING);
  relance(relancePaiement, partners, configuration);
});

export const relanceInformationPourGeneration = functions.https.onCall(async () => {
  const configuration = await getConfiguration(firestore);
  const data = await firestore.collection('companies-2025').get();
  const partners = data.docs.map((d) => d.data()).filter((p) => p.status.generated === StatusEnum.PENDING);
  relance(relanceInformationsComplementaires, partners, configuration);
});

export const newPartner = functions.firestore.document('companies-2025/{companyId}').onCreate(async (snap) => {
  const configuration = await getConfiguration(firestore);
  const company: Company = snap.data() as Company;
  const id = snap.id;

  if (!company.name) {
    return;
  }
  await addCreationDate(id);
  await sendWelcomeEmail(company, snap.id, configuration);
  await sendNewPartnerToOrganizationTeam(company, configuration);

  return updatesStatus(id, company, {
    filled: 'done',
    validated: 'pending'
  });
});

export const partnershipUpdated = functions
  .runWith({
    memory: '1GB'
  })
  .firestore.document('companies-2025/{companyId}')
  .onUpdate(async (changes) => {
    const configuration = await getConfiguration(firestore);
    const before = changes.before.data() as Company;
    const after = changes.after.data() as Company;
    if (!before || !after) {
      return;
    }
    const id = changes.after.id;

    return onDocumentChange(firestore, before, after, id, configuration);
  });

exports.updateConventionSignedUrlProperty = functions.storage.object().onFinalize(async (object) => {
  const name = object.name || '';
  return admin
    .storage()
    .bucket()
    .file(name)
    .getSignedUrl({ action: 'read', expires: '03-17-2025' })
    .then(([url]) => {
      return firestore.doc('companies-2025/' + name.replace('signed/', '')).update({
        conventionSignedUrl: url
      });
    });
});
