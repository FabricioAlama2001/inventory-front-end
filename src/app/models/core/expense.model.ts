import { TransactionDetailModel } from "./transaction-detail.model";
import {UserModel} from "@models/auth";

export interface ExpenseModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  description: string;
  date: Date;
  type: boolean;
  transactionDetails: TransactionDetailModel[];

  user:UserModel;
  client:UserModel;
}
