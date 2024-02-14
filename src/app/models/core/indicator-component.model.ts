import {ActivityModel, CatalogueModel} from '@models/core';

export interface IndicatorComponentModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreateIndicatorComponentDto extends Omit<IndicatorComponentModel, 'id'> {}

export interface UpdateIndicatorComponentDto extends Partial<Omit<IndicatorComponentModel, 'id'>> {}

export interface SelectIndicatorComponentDto extends Partial<IndicatorComponentModel> {}
