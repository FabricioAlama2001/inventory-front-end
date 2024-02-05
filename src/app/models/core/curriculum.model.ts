import {CareerModel,CatalogueModel} from "@models/core";

export interface CurriculumModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;
  isVisible: boolean;

  career:CareerModel;
  state:CatalogueModel;

  code: string;
  name: string;
  description: string;
  resolutionNumber: string;
  periodicAcademicNumber: number;
  weeksNumber: number;
}
export interface CreateCurriculumDto extends Omit<CurriculumModel, 'id'> {
}

export interface UpdateCurriculumDto extends Partial<Omit<CurriculumModel, 'id'>> {
}

export interface SelectCurriculumDto extends Partial<CurriculumModel> {
}
