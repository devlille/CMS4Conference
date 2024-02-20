import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from "axios";
import { Configuration } from "./model";

const firestore = admin.firestore();

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
      for (let webhook of configurationFromFirestore.webhooks!) {
        console.log(`Sending to webhook ${webhook} information about ${changes.after.data().name}`);
        await axios.post(webhook, changes.after);
      }
    }
  });
