import {CatalogueModel} from '@models/core';

export interface StrategyModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;
}

export interface CreateStrategyDto extends Omit<StrategyModel, 'id'> {}

export interface UpdateStrategyDto extends Partial<Omit<StrategyModel, 'id'>> {}

export interface SelectStrategyDto extends Partial<StrategyModel> {}
