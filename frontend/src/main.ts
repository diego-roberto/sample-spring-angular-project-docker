import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { EnumEnvProfile } from './environments/EnumEnvProfile';
import 'hammerjs';

if (environment.profile == EnumEnvProfile.PROD 
    || environment.profile == EnumEnvProfile.HML) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
