import { ExpenseGroupModel} from '@models/core';

export interface BudgetItemModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;

  expenseGroup: ExpenseGroupModel;
}

export interface CreateBudgetItemDto extends Omit<BudgetItemModel, 'id'> {}

export interface UpdateBudgetItemDto extends Partial<Omit<BudgetItemModel, 'id'>> {}

export interface SelectBudgetItemDto extends Partial<BudgetItemModel> {}
