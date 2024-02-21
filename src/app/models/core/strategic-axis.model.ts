
export interface StrategicAxisModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreateStrategicAxisDto extends Omit<StrategicAxisModel, 'id'> {}

export interface UpdateStrategicAxisDto extends Partial<Omit<StrategicAxisModel, 'id'>> {}

export interface SelectStrategicAxisDto extends Partial<StrategicAxisModel> {}
