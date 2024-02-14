import {CatalogueModel} from '@models/core';

export interface ContinentModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;
}

export interface CreateContinentDto extends Omit<ContinentModel, 'id'> {}

export interface UpdateContinentDto extends Partial<Omit<ContinentModel, 'id'>> {}

export interface SelectContinentDto extends Partial<ContinentModel> {}
