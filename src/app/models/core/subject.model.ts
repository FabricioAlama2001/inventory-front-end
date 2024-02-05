import {RoleModel} from '@models/auth';
import {CatalogueModel, CurriculumModel, EnrollmentDetailStateModel, SubjectRequirementModel} from '@models/core';


export interface SubjectModel {
  id: string;
  createAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  curriculum: CurriculumModel,
  academicPeriod: CatalogueModel;
  type: CatalogueModel;
  state: CatalogueModel;
  subjectPrerequisites: SubjectRequirementModel[];
  subjectCorequisites: SubjectRequirementModel[];

  autonomousHour: number;
  code: string;
  credits: number;
  name: string;
  practicalHour: number;
  scale: number;
  teacherHour: number;
  isVisible: boolean;

  items: SubjectModel[];

  academicState: string | undefined;
  enrollmentStates: EnrollmentDetailStateModel[];
}

export interface CreateSubjectDto extends Omit<SubjectModel, 'id'> {
}

export interface UpdateSubjectDto extends Partial<Omit<SubjectModel, 'id'>> {
}

export interface SelectSubjectDto extends Partial<SubjectModel> {
}
