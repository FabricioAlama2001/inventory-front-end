import {ActivityModel, CatalogueModel} from '@models/core';

export interface ProgrammingTypeModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
}

export interface CreateProgrammingTypeDto extends Omit<ProgrammingTypeModel, 'id'> {}

export interface UpdateProgrammingTypeDto extends Partial<Omit<ProgrammingTypeModel, 'id'>> {}

export interface SelectProgrammingTypeDto extends Partial<ProgrammingTypeModel> {}
