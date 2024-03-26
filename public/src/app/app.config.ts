import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  LOCALE_ID,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import localeFr from '@angular/common/locales/fr';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular-ivy';
import { provideToastr } from 'ngx-toastr';

import { registerLocaleData } from '@angular/common';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr(),
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
      provideFirebaseApp(() => initializeApp(environment.firebase!)),
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(provideFunctions(() => getFunctions())),
  ],
};
