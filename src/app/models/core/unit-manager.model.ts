import { RoleModel, UserModel } from "@models/auth";
import { UnitModel } from "./unit.model";

export interface UnitManagerModel {
    id: string;
    createAt: Date;
    updateAt: Date;
    deleteAt: Date;

    code: string;
    date: string;
    enabled: boolean;

    user: UserModel;
    role: RoleModel;
    unit: UnitModel;
  }

  export interface CreateUnitManagerDto extends Omit<UnitManagerModel, 'id'> {}

  export interface UpdateUnitManagerDto extends Partial<Omit<UnitManagerModel, 'id'>> {}

  export interface SelectUnitManagerDto extends Partial<UnitManagerModel> {}
