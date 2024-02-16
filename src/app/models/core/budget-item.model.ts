import { ExpenseGroupModel} from '@models/core';

export interface BudgetItemModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;

  expenseGroup: ExpenseGroupModel;
}

export interface CreateBudgetItemDto extends Omit<BudgetItemModel, 'id'> {}

export interface UpdateBudgetItemDto extends Partial<Omit<BudgetItemModel, 'id'>> {}

export interface SelectBudgetItemDto extends Partial<BudgetItemModel> {}
