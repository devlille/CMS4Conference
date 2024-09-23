import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyBZ_X49nBW358VEudENWzO-jH3wrgSCRoM',
        authDomain: 'cms4partners-ce427.firebaseapp.com',
        databaseURL: 'https://cms4partners-ce427.firebaseio.com',
        projectId: 'cms4partners-ce427',
        storageBucket: 'cms4partners-ce427.appspot.com',
        messagingSenderId: '486924521070',
        appId: '1:486924521070:web:0cb85efacc81b6c896207f',
        measurementId: 'G-S558S2HZ11',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(),
  ],
};
