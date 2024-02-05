import {CareerModel, CatalogueModel} from "@models/core";

export interface InstitutionModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;
  isVisible: boolean;

  address: CatalogueModel;
  state: CatalogueModel;
  careers: CareerModel[];
  acronym: string;
  cellphone: string;
  code: string;
  codeSniese: string;
  denomination: string;
  email: string;
  logo: string;
  name: string;
  phone: string;
  shortName: string;
  slogan: string;
  web: string;
}

export interface CreateInstitutionDto extends Omit<InstitutionModel, 'id'> {
}

export interface UpdateInstitutionDto extends Partial<Omit<InstitutionModel, 'id'>> {
}

export interface SelectInstitutionDto extends Partial<InstitutionModel> {
}
