import { TransactionModel } from "./transaction.model";

export interface TransactionDetailModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  observation: string;
  quantity: number;
  
  Transaction: TransactionModel[];
  //Producto: ProductoModel[];
}


