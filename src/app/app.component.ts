import { Component } from '@angular/core';
import { AppService } from './app.service';

import '../main.scss';

@Component({
	selector: 'app-my-app',
	template: require('./app.component.html'),
	styles: [
	    require('./app.component.scss')
	],
	providers: [
        AppService
    ]
})
export class AppComponent {
	constructor(public appService: AppService) {
    }
}
