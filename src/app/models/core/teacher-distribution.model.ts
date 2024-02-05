import { CatalogueModel, CareerModel, TeacherModel, SchoolPeriodModel, SubjectModel} from '@models/core';

export interface TeacherDistributionModel {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  parallel: CatalogueModel;
  teacher: TeacherModel;
  schoolPeriod: SchoolPeriodModel;
  subject: SubjectModel;
  workday: CatalogueModel;
  career: CareerModel;

  hours: number;
}

export interface CreateTeacherDistributionDto extends Omit<TeacherDistributionModel, 'id'> {}

export interface UpdateTeacherDistributionDto extends Partial<Omit<TeacherDistributionModel, 'id'>> {}

export interface SelectTeacherDistributionDto extends Partial<TeacherDistributionModel> {}