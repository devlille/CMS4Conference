import { Environement } from './environment.type';

export const environment: Environement = {
  title: 'CMS Devfest Lille',
  firebase: {
    apiKey: 'AIzaSyBZ_X49nBW358VEudENWzO-jH3wrgSCRoM',
    authDomain: 'cms4partners-ce427.firebaseapp.com',
    databaseURL: 'https://cms4partners-ce427.firebaseio.com',
    projectId: 'cms4partners-ce427',
    storageBucket: 'cms4partners-ce427.appspot.com',
    messagingSenderId: '486924521070',
    appId: '1:486924521070:web:0cb85efacc81b6c896207f',
    measurementId: 'G-S558S2HZ11',
  },
  emailDomain: 'gdglille.org',
  files: {
    'RIB du GDG Lille': '/assets/RIB.pdf',
    'Journal Officiel suite à la création du GDG Lille':
      '/assets/JournalOfficiel.pdf',
  },
  sponsoringTypes: [
    {
      value: 'Platinium',
      label: 'Platinium',
    },
    {
      value: 'Gold',
      label: 'Gold',
    },
    {
      value: 'Silver',
      label: 'Silver',
    },
    {
      value: 'Bronze',
      label: 'Bronze',
    },
    {
      value: 'Party',
      label: 'Party',
    },
    {
      value: 'Newsletter',
      label: 'Etre notifié la prochaine édition',
      enabled: true,
    },
  ],
};
