import {ComponentModel, FiscalYearModel} from '@models/core';

export interface ActivityModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;

  fiscalYear: FiscalYearModel;
  component: ComponentModel;
  componentId: string;
}

export interface CreateActivityDto extends Omit<ActivityModel, 'id'> {}

export interface UpdateActivityDto extends Partial<Omit<ActivityModel, 'id'>> {}

export interface SelectActivityDto extends Partial<ActivityModel> {}
