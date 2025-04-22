import { Component } from '@angular/core';
import { PropertyFormComponent } from './property-form/property-form.component';
import { ResultsComponent } from './results/results.component';

@Component({
  selector: 'app-root',
  imports: [PropertyFormComponent, ResultsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
