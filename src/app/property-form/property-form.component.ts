import { Component } from '@angular/core';
import { AdjustmentService } from '../adjustment.service';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent {
  subject = {
    sizeSqft: 0,
    age: 0,
    acreage: 0,
    garageSpaces: 0,
    bedrooms: 0,
    fullBaths: 0,
    halfBaths: 0,
    condition: 'Average',
    hasBasement: 'No',
    finishedBasementPercent: 0
  };

  comps = Array(6).fill(null).map(() => ({
    price: 0,
    isSold: 'No',
    sizeSqft: 0,
    age: 0,
    acreage: 0,
    garageSpaces: 0,
    bedrooms: 0,
    fullBaths: 0,
    halfBaths: 0,
    condition: 'Average',
    hasBasement: 'No',
    finishedBasementPercent: 0
  }));

  constructor(private adjuster: AdjustmentService) {}

  submit() {
    this.adjuster.setSubject(this.subject);
    this.adjuster.setComps(this.comps);
  }
}
