import {Injectable} from '@angular/core';
import {SelectCurriculumDto} from '@models/core';

@Injectable({
  providedIn: 'root'
})
export class CurriculumsService {

  constructor() {

  }

  get curriculum(): SelectCurriculumDto {
    return JSON.parse(String(sessionStorage.getItem('curriculum'))) as SelectCurriculumDto;
  }

  set curriculum(value: SelectCurriculumDto) {
    sessionStorage.setItem('curriculum', JSON.stringify(value));
  }
}
