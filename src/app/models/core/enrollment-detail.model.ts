import {CatalogueModel, EnrollmentDetailStateModel, EnrollmentModel, GradeModel, SubjectModel} from '@models/core';

export interface EnrollmentDetailModel {
    id?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    grades: GradeModel[];
    enrollmentDetailStates: EnrollmentDetailStateModel[];
    enrollmentDetailState: EnrollmentDetailStateModel;

    //foreingkeys
    academicState: CatalogueModel;
    enrollment: EnrollmentModel;
    parallel: CatalogueModel;
    subject: SubjectModel;
    subjectId: string;
    type: CatalogueModel;
    workday: CatalogueModel;

    academicObservation: string;
    number: number;
    date: Date;
    finalAttendance: number;
    finalGrade: number;
    observation: string;
}

export interface CreateEnrollmentDetailDto extends Omit<EnrollmentDetailModel, 'id'> {
}

export interface UpdateEnrollmentDetailDto extends Partial<Omit<EnrollmentDetailModel, 'id'>> {
}

export interface SelectEnrollmentDetailDto extends Partial<EnrollmentDetailModel> {
}
