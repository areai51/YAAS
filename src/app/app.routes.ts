import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';

export const APP_ROUTES: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'about', component: AboutComponent }
];
