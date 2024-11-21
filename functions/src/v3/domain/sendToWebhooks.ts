import axios from 'axios';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Change } from 'firebase-functions/v1';

import { Configuration } from '../../model';

export const sendToWebhooks = async (configuration: Configuration, changes: Change<QueryDocumentSnapshot>) => {
  const length = configuration.webhooks?.length ?? 0;
  if (length > 0) {
    for (const webhook of configuration.webhooks!) {
      console.log(`Sending to webhook ${webhook} information about ${changes.after.data().name}`);
      await axios.post(webhook, {
        id: changes.after.id,
        data: changes.after.data()
      });
    }
  }
};
