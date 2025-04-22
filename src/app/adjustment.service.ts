import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {
  private subject: any = {};
  private comps: any[] = [];

  private adjustmentsSubject = new BehaviorSubject<any[]>([]);
  public adjustments$ = this.adjustmentsSubject.asObservable();

  public averagePPSF: number = 0;

  setSubject(subjectData: any) {
    this.subject = subjectData;
    this.updateAdjustments();
  }

  setComps(compData: any[]) {
    this.comps = compData;
    this.updateAdjustments();
  }

  private updateAdjustments() {
    const adjustments = this.calculateAdjustments();
    this.adjustmentsSubject.next(adjustments);
  }

  getConditionValue(condition: string): number {
    const levels: Record<'Poor' | 'Fair' | 'Average' | 'Good' | 'Excellent', number> = {
      Poor: 1,
      Fair: 2,
      Average: 3,
      Good: 4,
      Excellent: 5
    };
    return levels[condition as keyof typeof levels] ?? 3;
  }

  private calculateAdjustments() {
    const soldComps = this.comps.filter(comp =>
      comp.isSold && comp.sizeSqft && comp.sizeSqft > 0
    );
    this.averagePPSF = soldComps.length
      ? soldComps.reduce((sum, comp) => sum + (comp.price / comp.sizeSqft), 0) / soldComps.length
      : 0;

    const adjustmentRate = Math.round(this.averagePPSF * 0.25);

    return this.comps.map((comp, index) => {
      const adjustments: any = {};
      let total = 0;
      const summary: string[] = [];

      // Square footage
      if (adjustmentRate && comp.sizeSqft !== this.subject.sizeSqft) {
        const diff = this.subject.sizeSqft - comp.sizeSqft;

        if(Math.abs(diff) > 100){
        const adj = diff * adjustmentRate;
        adjustments.size = adj;
        total += adj;
        summary.push(`$${Math.abs(adj)} for ${adj > 0 ? 'smaller' : 'larger'} size`);
        }
      }

      // Age
      const ageDiff = Math.abs(this.subject.age - comp.age);
      if (ageDiff > 10) {
        const adj = Math.floor(ageDiff / 10) * 1000 * (comp.age > this.subject.age ? -1 : 1);
        adjustments.age = adj;
        total += adj;
        summary.push(`$${Math.abs(adj)} for ${adj < 0 ? 'newer' : 'older'} age`);
      }

      // Acreage
      const acreageDiff = Math.floor(Math.abs(this.subject.acreage - comp.acreage) / 0.1);
      if (acreageDiff > 0) {
        const adj = acreageDiff * 1000 * (comp.acreage > this.subject.acreage ? -1 : 1);
        adjustments.acreage = adj;
        total += adj;
        summary.push(`$${Math.abs(adj)} for ${adj < 0 ? 'larger' : 'smaller'} lot`);
      }

      // Garage
      const garageDiff = this.subject.garageSpaces - comp.garageSpaces;
      if (garageDiff !== 0) {
        const adj = garageDiff * 2500;
        adjustments.garage = adj;
        total += adj;
        summary.push(`$${Math.abs(adj)} for ${adj > 0 ? 'fewer' : 'extra'} garage space(s)`);
      }

      //Bedrooms
      const bedDiff = this.subject.bedrooms - comp.bedrooms;
      if (bedDiff !== 0) {
  const adj = bedDiff * 3000;
  adjustments.bedrooms = adj;
  total += adj;
  summary.push(`$${Math.abs(adj)} for ${adj > 0 ? 'fewer' : 'extra'} bedroom(s)`);
      }

      // Bathrooms
      const fullBathDiff = this.subject.fullBaths - comp.fullBaths;
      const halfBathDiff = this.subject.halfBaths - comp.halfBaths;
      const bathAdj = (fullBathDiff * 3000) + (halfBathDiff * 1500);
      if (bathAdj !== 0) {
        adjustments.bathrooms = bathAdj;
        total += bathAdj;
        summary.push(`$${Math.abs(bathAdj)} for bath count`);
      }

      // Condition
      const condDiff = this.getConditionValue(comp.condition) - this.getConditionValue(this.subject.condition);
      if (condDiff !== 0) {
        const adj = -condDiff * 10000;
        adjustments.condition = adj;
        total += adj;
        summary.push(`$${Math.abs(adj)} for ${adj < 0 ? 'superior' : 'inferior'} condition`);
      }

      // Basement
      const subjectHas = this.subject.hasBasement === 'Yes';
      const compHas = comp.hasBasement === 'Yes';
      const subjectPercent = subjectHas ? this.subject.finishedBasementPercent : 0;
      const compPercent = compHas ? comp.finishedBasementPercent : 0;

      if (subjectHas !== compHas) {
        const adj = subjectHas ? 5000 : -5000;
        adjustments.basement = adj;
        total += adj;
        summary.push(`$${Math.abs(adj)} for ${adj < 0 ? 'superior' : 'inferior'} basement`);
      } else if (subjectHas && compHas) {
        const percentDiff = subjectPercent - compPercent;
        if (percentDiff !== 0) {
          const adj = (percentDiff / 25) * 1125;
          adjustments.basement = adj;
          total += adj;
          summary.push(`$${Math.abs(adj)} for basement finish`);
        }
      }

      return {
        compIndex: index + 1,
        adjustments,
        totalAdjustment: total,
        summary: `Comp ${index + 1} adjusted $${total.toLocaleString()}: ${summary.join(', ')}.`
      };
    });
  }
}
