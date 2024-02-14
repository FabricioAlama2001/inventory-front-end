import {CatalogueModel} from '@models/core';

export interface UnitModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  acronym: string;
  name: string;
  executer: string;
  level: string;
  enabled: boolean;
}

export interface CreateUnitDto extends Omit<UnitModel, 'id'> {}

export interface UpdateUnitDto extends Partial<Omit<UnitModel, 'id'>> {}

export interface SelectUnitDto extends Partial<UnitModel> {}
