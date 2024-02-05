import {Injectable} from '@angular/core';
import { SelectTeacherDistributionDto } from '@models/core';


@Injectable({
  providedIn: 'root'
})
export class TeacherDistributionsService {

  constructor() {

  }

  get teacherDistribution(): SelectTeacherDistributionDto {
    return JSON.parse(String(sessionStorage.getItem('teacher-distribution'))) as SelectTeacherDistributionDto;
  }

  set teacherDistribution(value: SelectTeacherDistributionDto) {
    sessionStorage.setItem('teacher-distribution', JSON.stringify(value));
  }
}
