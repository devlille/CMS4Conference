import { Change } from "firebase-functions/v1";
import { Configuration } from "../../model";
import axios from "axios";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

export const sendToWebhooks = async (
  configuration: Configuration,
  changes: Change<QueryDocumentSnapshot>
) => {
  if (configuration.webhooks?.length! > 0) {
    for (const webhook of configuration.webhooks!) {
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
};
