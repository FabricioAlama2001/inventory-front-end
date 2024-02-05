import {StudentModel, CatalogueModel} from "@models/core";

export interface InformationStudentModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;
  isVisible: boolean;

  student: StudentModel;

  isExecutedPractice: CatalogueModel;
  isExecutedCommunity: CatalogueModel;
  isDisability: CatalogueModel;
  isLostGratuity: CatalogueModel;
  isSubjectRepeat: CatalogueModel;

  address: string;
  community: number;
  contactEmergencyName: string;
  contactEmergencyKinship: string;
  contactEmergencyPhone: string;
  disabilityPercentage: number;
  economicAmount: number;
  educationalAmount: number;
  familyIncome: number;
  financingScholarshipType: string;
  membersHouseNumber: number;
  practiceHours: number;
  postalCode: string;
  scholarshipAmount: number;
  tariffScholarshipPercentage: number;
}

export interface CreateInformationStudentDto extends Omit<InformationStudentModel, 'id'> {
}

export interface UpdateInformationStudentDto extends Partial<Omit<InformationStudentModel, 'id'>> {
}

export interface SelectInformationStudentDto extends Partial<InformationStudentModel> {
}
