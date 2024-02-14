import { ExpenseGroupModel, IndicatorComponentModel, ProjectModel} from '@models/core';

export interface ComponentModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  fiscalYear: number;
  enabled: boolean;

  indicatorComponent: IndicatorComponentModel;
  project: ProjectModel;
}

export interface CreateComponentDto extends Omit<ComponentModel, 'id'> {}

export interface UpdateComponentDto extends Partial<Omit<ComponentModel, 'id'>> {}

export interface SelectComponentDto extends Partial<ComponentModel> {}
