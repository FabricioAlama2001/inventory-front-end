import { PartialModel } from './partial.model';
import { EnrollmentDetailModel } from './enrollment-detail.model';

export interface GradeModel {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  enrollmentDetailModel:EnrollmentDetailModel
  partial: PartialModel;
  value: number;
}

export interface CreateGradeDto extends Omit<GradeModel, 'id'> {}

export interface UpdateGradeDto extends Partial<Omit<GradeModel, 'id'>> {}

export interface SelectGradeDto extends Partial<GradeModel> {}
