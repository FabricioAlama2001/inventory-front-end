import {CatalogueModel} from '@models/core';

export interface StrategicAxisModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;
}

export interface CreateStrategicAxisDto extends Omit<StrategicAxisModel, 'id'> {}

export interface UpdateStrategicAxisDto extends Partial<Omit<StrategicAxisModel, 'id'>> {}

export interface SelectStrategicAxisDto extends Partial<StrategicAxisModel> {}
