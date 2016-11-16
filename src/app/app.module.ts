import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { AppComponent } from './app.component';

/**
 * @TODO: Example service (HTTP interaction), routing, nested directives, pipe + related tests
 */
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
