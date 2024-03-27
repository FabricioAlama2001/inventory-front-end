import { ApplicationStatusModel } from "./application-status.model";
import { DocumentTypeModel } from "./document-type.model";
import { FiscalYearModel } from "./fiscal-year.model";
import { UnitModel } from "./unit.model";
import {TransactionDetailModel} from "@models/core/transaction-detail.model";


export interface TransactionModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  subject: string;
  esigef: string;
  value: number;
  isIva: boolean;
  description: string;
  enabled: boolean;
  state: boolean;

  documentType: DocumentTypeModel;
  applicationStatus: ApplicationStatusModel;
  parent?: TransactionModel;
  process?: TransactionModel;
  fiscalYear: FiscalYearModel;
  unit: UnitModel;
  principalUnit?: UnitModel;
  transactionDetails?: TransactionDetailModel[];
}

export interface CreateTransactionDto extends Omit<TransactionModel, 'id'> {}

export interface UpdateTransactionDto extends Partial<Omit<TransactionModel, 'id'>> {}

export interface SelectTransactionDto extends Partial<TransactionModel> {}
