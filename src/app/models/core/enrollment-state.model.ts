import {CatalogueModel, EnrollmentModel} from "@models/core";

export interface EnrollmentStateModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  state:CatalogueModel;
  enrollment: EnrollmentModel;

  observation: string;
}
export interface CreateEnrollmentStateDto extends Omit<EnrollmentStateModel, 'id'> {
}

export interface UpdateEnrollmentStateDto extends Partial<Omit<EnrollmentStateModel, 'id'>> {
}

export interface SelectEnrollmentStateDto extends Partial<EnrollmentStateModel> {
}
