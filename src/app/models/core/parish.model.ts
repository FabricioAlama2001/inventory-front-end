import {CatalogueModel} from '@models/core';

export interface ParishModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;
}

export interface CreateParishDto extends Omit<ParishModel, 'id'> {}

export interface UpdateParishDto extends Partial<Omit<ParishModel, 'id'>> {}

export interface SelectParishDto extends Partial<ParishModel> {}
