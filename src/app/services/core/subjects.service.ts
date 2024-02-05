import {Injectable} from '@angular/core';
import {SelectSubjectDto, SubjectModel} from '@models/core';


@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor() {

  }

  get subject(): SubjectModel {
    return JSON.parse(String(sessionStorage.getItem('subject')));
  }

  set subject(value: SubjectModel) {
    sessionStorage.setItem('subject', JSON.stringify(value));
  }

  get enrollmentSubjects(): SubjectModel[] {
    return JSON.parse(String(sessionStorage.getItem('enrollmentSubjects')));
  }

  set enrollmentSubjects(value: SubjectModel[]) {
    sessionStorage.setItem('enrollmentSubjects', JSON.stringify(value));
  }
}
