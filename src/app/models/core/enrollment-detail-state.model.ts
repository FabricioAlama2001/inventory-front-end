import {CatalogueModel, EnrollmentModel} from "@models/core";

export interface EnrollmentDetailStateModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  state:CatalogueModel;
  enrollment: EnrollmentModel;

  observation: string;
}
export interface CreateEnrollmentDetailStateDto extends Omit<EnrollmentDetailStateModel, 'id'> {
}

export interface UpdateEnrollmentDetailStateDto extends Partial<Omit<EnrollmentDetailStateModel, 'id'>> {
}

export interface SelectEnrollmentDetailStateDto extends Partial<EnrollmentDetailStateModel> {
}
