import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjustmentService } from '../adjustment.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  adjustments: any[] = [];
  ppsf: number = 0;

  constructor(private adjuster: AdjustmentService) {
    this.adjuster.adjustments$.subscribe(data => {
      this.adjustments = data;
      this.ppsf = this.adjuster.averagePPSF;
    });
  }

  getAdjustmentKeys(adjustments: any): string[] {
    return Object.keys(adjustments);
  }
}
