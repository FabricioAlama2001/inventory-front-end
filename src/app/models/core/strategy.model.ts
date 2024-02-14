import {CatalogueModel} from '@models/core';

export interface StrategyModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreateStrategyDto extends Omit<StrategyModel, 'id'> {}

export interface UpdateStrategyDto extends Partial<Omit<StrategyModel, 'id'>> {}

export interface SelectStrategyDto extends Partial<StrategyModel> {}
