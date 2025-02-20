import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(HttpClientModule),
  provideRouter(routes, withComponentInputBinding()),
  provideHttpClient(),
  provideToastr(),
  provideNgxMask(),
  provideAnimations(),
  ],
};
