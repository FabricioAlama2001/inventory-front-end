import {CatalogueModel} from '@models/core';

export interface CountryModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  name: string;
  enabled: boolean;
}

export interface CreateCountryDto extends Omit<CountryModel, 'id'> {}

export interface UpdateCountryDto extends Partial<Omit<CountryModel, 'id'>> {}

export interface SelectCountryDto extends Partial<CountryModel> {}
