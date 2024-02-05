import {Injectable} from '@angular/core';
import {CareerModel, SelectCareerDto} from '@models/core';

@Injectable({
  providedIn: 'root'
})
export class CareersService {

  constructor() {

  }

  get career(): CareerModel {
    return JSON.parse(String(sessionStorage.getItem('career')));
  }

  set career(value: CareerModel) {
    sessionStorage.setItem('career', JSON.stringify(value));
  }

  get careers(): CareerModel[] {
    return JSON.parse(String(sessionStorage.getItem('careers')));
  }

  set careers(value: CareerModel[]) {
    sessionStorage.setItem('careers', JSON.stringify(value));
  }
}
