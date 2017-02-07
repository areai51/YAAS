import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { AboutComponent } from './about';

/**
 * @TODO: Example service (HTTP interaction), nested directives, pipe + related tests
 */
@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		AboutComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(APP_ROUTES)
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
