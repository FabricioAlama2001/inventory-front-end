import {ExpenseTypeModel, FiscalYearModel, PndObjectiveModel, PndPoliceModel} from '@models/core';

export interface ProjectModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;

  fiscalYear: FiscalYearModel;
  pndObjective: PndObjectiveModel;
  pndPolice: PndPoliceModel;
  expenseType: ExpenseTypeModel,

}

export interface CreateProjectDto extends Omit<ProjectModel, 'id'> {}

export interface UpdateProjectDto extends Partial<Omit<ProjectModel, 'id'>> {}

export interface SelectProjectDto extends Partial<ProjectModel> {}
