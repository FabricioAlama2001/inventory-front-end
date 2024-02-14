import {CatalogueModel} from '@models/core';

export interface IndicatorSubactivityModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;
}

export interface CreateIndicatorSubactivityDto extends Omit<IndicatorSubactivityModel, 'id'> {}

export interface UpdateIndicatorSubactivityDto extends Partial<Omit<IndicatorSubactivityModel, 'id'>> {}

export interface SelectIndicatorSubactivityDto extends Partial<IndicatorSubactivityModel> {}
