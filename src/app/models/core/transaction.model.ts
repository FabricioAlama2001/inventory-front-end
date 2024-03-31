import { TransactionDetailModel } from "./transaction-detail.model";

export interface TransactionModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  description: string;
  date: Date;
  type: boolean;
  transactionDetails: TransactionDetailModel[];
}
