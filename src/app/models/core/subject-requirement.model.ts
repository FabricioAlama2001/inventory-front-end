import {SubjectModel} from '@models/core';


export interface SubjectRequirementModel {
  id: string;
  createAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  subject: SubjectModel;
  requirement: SubjectModel;

  isEnabled: boolean;
}

export interface CreateSubjectRequirementDto extends Omit<SubjectRequirementModel, 'id'> {
}

export interface UpdateSubjectRequirementDto extends Partial<Omit<SubjectRequirementModel, 'id'>> {
}

export interface SelectSubjectRequirementDto extends Partial<SubjectRequirementModel> {
}
