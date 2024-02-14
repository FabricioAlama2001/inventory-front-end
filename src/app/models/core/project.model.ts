import {ExpenseTypeModel, PndObjectiveModel, PndPoliceModel} from '@models/core';

export interface ProjectModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  fiscalYear: number;
  enabled: boolean;

  pndObjective: PndObjectiveModel;
  pndPolice: PndPoliceModel;
  expenseType: ExpenseTypeModel,

}

export interface CreateProjectDto extends Omit<ProjectModel, 'id'> {}

export interface UpdateProjectDto extends Partial<Omit<ProjectModel, 'id'>> {}

export interface SelectProjectDto extends Partial<ProjectModel> {}
