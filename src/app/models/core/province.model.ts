import {CatalogueModel} from '@models/core';

export interface ProvinceModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;
}

export interface CreateProvinceDto extends Omit<ProvinceModel, 'id'> {}

export interface UpdateProvinceDto extends Partial<Omit<ProvinceModel, 'id'>> {}

export interface SelectProvinceDto extends Partial<ProvinceModel> {}
