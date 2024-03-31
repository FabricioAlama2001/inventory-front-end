import { ProductModel } from "./product.model";

export interface CategoryModel {
  id: string;
  parentId: string;
  code: string;
  name: string;
  description: string;
  parent: CategoryModel;
  enabled:boolean;
  products:ProductModel;
}
