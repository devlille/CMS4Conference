import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const firestore = admin.firestore();

import { Axios } from "axios";
import { Configuration } from "./model";

export const onSendChangesToWebHooks = functions.firestore
  .document("companies-2024/{companyId}")
  .onUpdate(async (changes) => {
    const configurationFromFirestore = await firestore
      .doc("configuration/invoice_2024")
      .get()
      .then((configuration) => {
        return configuration.data() as Configuration;
      });

    if (configurationFromFirestore.webhooks?.length! > 0) {
      const client = new Axios();

      for (let webhook of configurationFromFirestore.webhooks!) {
        console.log(`Sending to webhook ${webhook} information about ${changes.after.data().name}`);
        await client.post(webhook, changes.after);
      }
    }
  });
