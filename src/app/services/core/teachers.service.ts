import {Injectable} from '@angular/core';
import { SelectTeacherDto } from '@models/core';


@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  constructor() {

  }

  get teacher(): SelectTeacherDto {
    return JSON.parse(String(sessionStorage.getItem('teacher'))) as SelectTeacherDto;
  }

  set teacher(value: SelectTeacherDto) {
    sessionStorage.setItem('teacher', JSON.stringify(value));
  }
}
