import { CategoryModel } from "./category.model";
import { TransactionDetailModel } from "./transaction-detail.model";

export interface ProductModel {
  id: string;
  code: string;
  cost_price: number;
  name: string;
  description: string;
  enabled:boolean;
  products:ProductModel;
  transactionDetails: TransactionDetailModel[];
  category: CategoryModel;
  categoryId: string;
  minimumAmount: number;
  sellingPrice: number;
  stock: number;
}
