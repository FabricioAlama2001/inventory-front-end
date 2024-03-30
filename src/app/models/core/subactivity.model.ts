import {
  ActivityModel, BudgetItemModel,
  CantonModel,
  ContinentModel,
  CountryModel,
  FiscalYearModel,
  IndicatorSubactivityModel,
  InstitutionalStrategicPlanModel,
  ParishModel,
  ProvinceModel,
  StrategicAxisModel,
  StrategyModel,
  UnitModel
} from '@models/core';

export interface SubactivityModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  type: string;
  enabled: boolean;

  activity: ActivityModel;
  budgetItem: BudgetItemModel;
  fiscalYear: FiscalYearModel;
  indicatorSubactivity: IndicatorSubactivityModel;
  institutionalStrategicPlan: InstitutionalStrategicPlanModel;
  strategicAxis: StrategicAxisModel;
  strategy: StrategyModel;
  continent: ContinentModel;
  country: CountryModel;
  province: ProvinceModel;
  canton: CantonModel;
  parish: ParishModel;
  unit: UnitModel;
}

export interface CreateSubactivityDto extends Omit<SubactivityModel, 'id'> {}

export interface UpdateSubactivityDto extends Partial<Omit<SubactivityModel, 'id'>> {}

export interface SelectSubactivityDto extends Partial<SubactivityModel> {}
