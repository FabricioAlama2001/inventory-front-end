import {TransactionDetailModel} from "./transaction-detail.model";
import {UserModel} from "@models/auth";
import {SignatureModel} from "@models/core";

export interface IncomeModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  description: string;
  date: Date;
  type: boolean;
  transactionDetails: TransactionDetailModel[];
  transactionInDetails: TransactionDetailModel[];
  transactionOutDetails: TransactionDetailModel[];

  user: UserModel;
  client: UserModel;
  signature: SignatureModel;
}
