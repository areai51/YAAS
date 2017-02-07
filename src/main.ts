import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

console.log('Metadata Build Info :: ' + JSON.stringify(GlobalEnvironment));

if (GlobalEnvironment.production) {
	enableProdMode();
}

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
