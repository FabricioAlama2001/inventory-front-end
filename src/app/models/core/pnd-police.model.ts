import {ActivityModel, CatalogueModel, PndObjectiveModel} from '@models/core';

export interface PndPoliceModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
  
  pndObjective: PndObjectiveModel;
}

export interface CreatePndPoliceDto extends Omit<PndPoliceModel, 'id'> {}

export interface UpdatePndPoliceDto extends Partial<Omit<PndPoliceModel, 'id'>> {}

export interface SelectPndPoliceDto extends Partial<PndPoliceModel> {}
