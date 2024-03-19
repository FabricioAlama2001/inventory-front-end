import { ApplicationStatusModel } from "./application-status.model";
import { DocumentTypeModel } from "./document-type.model";
import { FiscalYearModel } from "./fiscal-year.model";
import { ProgrammingTypeModel } from "./programming-type.model";
import { SubactivityModel } from "./subactivity.model";
import { TransactionModel } from "./transaction.model";
import { UnitModel } from "./unit.model";


export interface TransactionDetailModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  amount: number;
  advance: number;
  cur: string;
  goal: number;
  date: Date;
  isIva: boolean;
  enabled: boolean;
  state: boolean;

  process?: TransactionModel;
  unit: UnitModel;
  principalUnit?: UnitModel;
  documentType: DocumentTypeModel;
  transaction: TransactionModel;
  subactivity: SubactivityModel;
  programmingType: ProgrammingTypeModel;
}

export interface CreateTransactionDetailDto extends Omit<TransactionDetailModel, 'id'> {}

export interface UpdateTransactionDetailDto extends Partial<Omit<TransactionDetailModel, 'id'>> {}

export interface SelectTransactionDetailDto extends Partial<TransactionDetailModel> {}
