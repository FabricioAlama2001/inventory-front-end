
export interface FiscalYearModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  enabled: boolean;
  sort: number;
}

export interface CreateFiscalYearDto extends Omit<FiscalYearModel, 'id'> {}

export interface UpdateFiscalYearDto extends Partial<Omit<FiscalYearModel, 'id'>> {}

export interface SelectFiscalYearDto extends Partial<FiscalYearModel> {}
