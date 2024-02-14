import {ActivityModel, CatalogueModel} from '@models/core';

export interface ExpenseTypeModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreateExpenseTypeDto extends Omit<ExpenseTypeModel, 'id'> {}

export interface UpdateExpenseTypeDto extends Partial<Omit<ExpenseTypeModel, 'id'>> {}

export interface SelectExpenseTypeDto extends Partial<ExpenseTypeModel> {}
