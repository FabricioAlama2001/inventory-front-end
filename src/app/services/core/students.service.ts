import {Injectable} from '@angular/core';
import {SelectStudentDto} from '@models/core';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor() {

  }

  get student(): SelectStudentDto | {} {
    return JSON.parse(String(sessionStorage.getItem('student'))) as SelectStudentDto;
  }

  set student(value: SelectStudentDto) {
    sessionStorage.setItem('student', JSON.stringify(value));
  }
}
