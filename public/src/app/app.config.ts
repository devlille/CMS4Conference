import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  LOCALE_ID,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import localeFr from '@angular/common/locales/fr';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular-ivy';

import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },

    { provide: LOCALE_ID, useValue: 'fr' },
    provideAnimations(),
    importProvidersFrom(
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
        }),
      ),
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
  ],
};
