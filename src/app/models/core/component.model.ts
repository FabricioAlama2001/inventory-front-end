import {
  ActivityModel,
  ExpenseGroupModel,
  FiscalYearModel,
  IndicatorComponentModel,
  ProjectModel,
  SubactivityModel
} from '@models/core';

export interface ComponentModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;

  fiscalYear: FiscalYearModel;
  indicatorComponent: IndicatorComponentModel;
  project: ProjectModel;
  projectId: string;

  activities: ActivityModel[];
}

export interface CreateComponentDto extends Omit<ComponentModel, 'id'> {}

export interface UpdateComponentDto extends Partial<Omit<ComponentModel, 'id'>> {}

export interface SelectComponentDto extends Partial<ComponentModel> {}
