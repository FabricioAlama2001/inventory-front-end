import {CatalogueModel} from '@models/core';

export interface InstitutionalStrategicPlanModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreateInstitutionalStrategicPlanDto extends Omit<InstitutionalStrategicPlanModel, 'id'> {}

export interface UpdateInstitutionalStrategicPlanDto extends Partial<Omit<InstitutionalStrategicPlanModel, 'id'>> {}

export interface SelectInstitutionalStrategicPlanDto extends Partial<InstitutionalStrategicPlanModel> {}
