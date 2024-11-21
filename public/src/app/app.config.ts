import localeFr from '@angular/common/locales/fr';
import { ApplicationConfig, ErrorHandler, LOCALE_ID } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import * as Sentry from '@sentry/angular-ivy';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
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
    { provide: LOCALE_ID, useValue: 'fr' },
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebase!)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    provideHttpClient(),
  ],
};
