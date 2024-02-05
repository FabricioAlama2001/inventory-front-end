import {Injectable} from '@angular/core';
import {SchoolPeriodModel, SelectSchoolPeriodDto} from '@models/core';


@Injectable({
  providedIn: 'root'
})
export class SchoolPeriodsService {

  constructor() {

  }

  get openSchoolPeriod(): SchoolPeriodModel {
    return JSON.parse(String(sessionStorage.getItem('openSchoolPeriod'))) as SchoolPeriodModel;
  }

  set openSchoolPeriod(value: SchoolPeriodModel) {
    sessionStorage.setItem('openSchoolPeriod', JSON.stringify(value));
  }
}
