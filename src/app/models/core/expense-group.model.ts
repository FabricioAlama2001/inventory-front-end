import {ActivityModel, CatalogueModel} from '@models/core';

export interface ExpenseGroupModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;

}

export interface CreateExpenseGroupDto extends Omit<ExpenseGroupModel, 'id'> {}

export interface UpdateExpenseGroupDto extends Partial<Omit<ExpenseGroupModel, 'id'>> {}

export interface SelectExpenseGroupDto extends Partial<ExpenseGroupModel> {}
