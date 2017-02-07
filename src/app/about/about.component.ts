import { Component, OnInit } from '@angular/core';

@Component({
    // The selector is what angular internally uses
    // for `document.querySelectorAll(selector)` in our index.html
    // where, in this case, selector is the string 'about'
    selector: 'app-about-page',  // <about></about>
    // Every Angular template is first compiled by the browser before Angular runs it's compiler
    templateUrl: './about.component.html',
    // Our list of styles in our component. We may add more to compose many styles together
    styleUrls: [ './about.component.scss' ]
})
export class AboutComponent implements OnInit {
    constructor() {
        //
    }

    public ngOnInit() {
        console.log('hello `About` component');
    }
}
