import {CantonModel, ContinentModel, CountryModel, IndicatorSubactivityModel, InstitutionalStrategicPlanModel, ParishModel, PoaModel, ProvinceModel, StrategicAxisModel, StrategyModel, UnitModel} from '@models/core';

export interface SubactivityModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  type: string;
  fiscalYear: Number;
  enabled: boolean;

  indicatorSubactivity: IndicatorSubactivityModel;
  institutionalStrategicPlan: InstitutionalStrategicPlanModel;
  strategicAxis: StrategicAxisModel;
  strategy: StrategyModel;
  continent: ContinentModel;
  country: CountryModel;
  province: ProvinceModel;
  canton: CantonModel;
  parish: ParishModel;
  poa: PoaModel;
  unit: UnitModel;
}

export interface CreateSubactivityDto extends Omit<SubactivityModel, 'id'> {}

export interface UpdateSubactivityDto extends Partial<Omit<SubactivityModel, 'id'>> {}

export interface SelectSubactivityDto extends Partial<SubactivityModel> {}
