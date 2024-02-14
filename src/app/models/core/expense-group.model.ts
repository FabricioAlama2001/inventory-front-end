import {ActivityModel, CatalogueModel} from '@models/core';

export interface ExpenseGroupModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreateExpenseGroupDto extends Omit<ExpenseGroupModel, 'id'> {}

export interface UpdateExpenseGroupDto extends Partial<Omit<ExpenseGroupModel, 'id'>> {}

export interface SelectExpenseGroupDto extends Partial<ExpenseGroupModel> {}
