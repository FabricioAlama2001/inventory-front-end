import { IncomeModel } from "./income.model";
import {ProductModel} from "@models/core/product.model";

export interface TransactionDetailModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  observation: string;
  quantity: number;

  transaction: IncomeModel[];
  product: ProductModel;
}


