import {ActivityModel, BudgetItemModel, CatalogueModel, ExpenseTypeModel, FundingSourceModel} from '@models/core';

export interface PoaModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  activity: ActivityModel;
  budgetItem: BudgetItemModel;
  fundingSource: FundingSourceModel;
  expenseType: ExpenseTypeModel;

  activityId: string;
  budgetItemId: string;
  fundingSourceId: string;
  expenseTypeId: string;
}

export interface CreatePoaDto extends Omit<PoaModel, 'id'> {}

export interface UpdatePoaDto extends Partial<Omit<PoaModel, 'id'>> {}

export interface SelectPoaDto extends Partial<PoaModel> {}
