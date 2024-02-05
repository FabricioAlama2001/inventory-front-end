import { CatalogueModel } from "./catalogue.model";
import { TeacherModel } from "./teacher.model";
export interface InformationTeacherModel{
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isVisible:boolean;

  teacher: TeacherModel;
  countryHigherEducation: CatalogueModel;
  higherEducation: CatalogueModel;
  scholarship: CatalogueModel;
  scholarshipType: CatalogueModel;
  teachingLadder: CatalogueModel;
  academicUnit: string;
  administrativeHours: number;
  classHours: number;
  communityHours: number;
  degreeHigherEducation: string;
  hoursWorked: number;
  holidays: Date;
  homeVacation: Date;
  institutionHigherEducation: string;
  investigationHours: number;
  otherHours: number;
  publications: string;
  scholarshipAmount: number;
  state: boolean;
  totalSubjects: number;
  technical: string;
  technology: string;
  totalPublications: number;
}
