import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from "axios";
import { Configuration } from "./model";

const firestore = admin.firestore();

export const onSendChangesToWebHooks = functions.firestore
  .document("companies-2025/{companyId}")
  .onUpdate(async (changes) => {
    const configurationFromFirestore = await firestore
      .doc("editions/2025")
      .get()
      .then((configuration) => {
        return configuration.data() as Configuration;
      });

    if (configurationFromFirestore.webhooks?.length! > 0) {
      for (let webhook of configurationFromFirestore.webhooks!) {
        console.log(
          `Sending to webhook ${webhook} information about ${
            changes.after.data().name
          }`
        );
        await axios.post(webhook, {
          id: changes.after.id,
          data: changes.after.data(),
        });
      }
    }
  });
