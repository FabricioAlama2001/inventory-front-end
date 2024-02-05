import {CatalogueModel, EnrollmentDetailModel, SchoolPeriodModel, StudentModel, SubjectModel} from "@models/core";
import {EnrollmentStateModel} from "@models/core/enrollment-state.model";

export interface EnrollmentModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;
  isVisible: boolean;

  academicState:CatalogueModel;
  enrollmentDetails: EnrollmentDetailModel[];
  enrollmentStates: EnrollmentStateModel[];
  enrollmentState: EnrollmentStateModel;
  academicPeriod: CatalogueModel;
  parallel: CatalogueModel;
  state: CatalogueModel;
  subject: SubjectModel;
  type: CatalogueModel;
  workday: CatalogueModel;
  student: StudentModel;
  schoolPeriod: SchoolPeriodModel;

  number: number;
  date: Date;
  finalAttendance: number;
  finalGrade: number;
  observation: string;
}
export interface CreateEnrollmentDto extends Omit<EnrollmentModel, 'id'> {
}

export interface UpdateEnrollmentDto extends Partial<Omit<EnrollmentModel, 'id'>> {
}

export interface SelectEnrollmentDto extends Partial<EnrollmentModel> {
}
