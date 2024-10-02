import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { getConfiguration } from "./v3/infrastructure/getConfiguration";
import { sendToWebhooks } from "./v3/domain/sendToWebhooks";

const firestore = admin.firestore();

export const onSendChangesToWebHooks = functions.firestore
  .document("companies-2025/{companyId}")
  .onUpdate(async (changes) => {
    const configuration = await getConfiguration(firestore);
    sendToWebhooks(configuration, changes);
  });
