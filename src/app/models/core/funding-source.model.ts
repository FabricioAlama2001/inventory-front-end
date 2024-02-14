import {ActivityModel, CatalogueModel} from '@models/core';

export interface FundingSourceModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;

}

export interface CreateFundingSourceDto extends Omit<FundingSourceModel, 'id'> {}

export interface UpdateFundingSourceDto extends Partial<Omit<FundingSourceModel, 'id'>> {}

export interface SelectFundingSourceDto extends Partial<FundingSourceModel> {}
