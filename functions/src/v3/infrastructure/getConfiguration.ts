import { Firestore } from 'firebase-admin/firestore';

import { Configuration } from '../../model';

export const getConfiguration = (firestore: Firestore): Promise<Configuration> => {
  return firestore
    .doc('editions/2025')
    .get()
    .then((invoice) => {
      return invoice.data() as Configuration;
    });
};
