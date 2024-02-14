import {ActivityModel, CatalogueModel} from '@models/core';

export interface PndObjectiveModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreatePndObjectiveDto extends Omit<PndObjectiveModel, 'id'> {}

export interface UpdatePndObjectiveDto extends Partial<Omit<PndObjectiveModel, 'id'>> {}

export interface SelectPndObjectiveDto extends Partial<PndObjectiveModel> {}
