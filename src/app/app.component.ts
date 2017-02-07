import { Component } from '@angular/core';
import { AppService } from './app.service';

import '../main.scss';

@Component({
	selector: 'app-my-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [
        AppService
    ]
})
export class AppComponent {
	constructor(public appService: AppService) {
    }
}
