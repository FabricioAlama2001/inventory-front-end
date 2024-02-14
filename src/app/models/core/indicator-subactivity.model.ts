import {CatalogueModel} from '@models/core';

export interface IndicatorSubactivityModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreateIndicatorSubactivityDto extends Omit<IndicatorSubactivityModel, 'id'> {}

export interface UpdateIndicatorSubactivityDto extends Partial<Omit<IndicatorSubactivityModel, 'id'>> {}

export interface SelectIndicatorSubactivityDto extends Partial<IndicatorSubactivityModel> {}
