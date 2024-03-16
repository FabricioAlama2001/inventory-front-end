
export interface UnitModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  acronym: string;
  name: string;
  executer: boolean;
  level: string;
  enabled: boolean;

  principal: UnitModel;
  parent: UnitModel;
}

export interface CreateUnitDto extends Omit<UnitModel, 'id'> {}

export interface UpdateUnitDto extends Partial<Omit<UnitModel, 'id'>> {}

export interface SelectUnitDto extends Partial<UnitModel> {}
