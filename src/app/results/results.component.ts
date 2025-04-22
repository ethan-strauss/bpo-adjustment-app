import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  @Input() adjustments: any[] = [];
  @Input() ppsf: number = 0;

  getAdjustmentKeys(adjustments: any): string[] {
    return Object.keys(adjustments);
  }
}
