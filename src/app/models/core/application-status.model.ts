import { ExpenseGroupModel} from '@models/core';

export interface ApplicationStatusModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
}

export interface CreateApplicationStatusDto extends Omit<ApplicationStatusModel, 'id'> {}

export interface UpdateApplicationStatusDto extends Partial<Omit<ApplicationStatusModel, 'id'>> {}

export interface SelectApplicationStatusDto extends Partial<ApplicationStatusModel> {}
