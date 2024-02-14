import {CatalogueModel} from '@models/core';

export interface CantonModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;
}

export interface CreateCantonDto extends Omit<CantonModel, 'id'> {}

export interface UpdateCantonDto extends Partial<Omit<CantonModel, 'id'>> {}

export interface SelectCantonDto extends Partial<CantonModel> {}
