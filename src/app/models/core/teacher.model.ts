import { UserModel } from "@models/auth";
import { InformationTeacherModel } from "./info-teacher.model";
import {CareerModel} from "@models/core/career.model";

export interface TeacherModel{
  id?: string;
  informationTeacher?: InformationTeacherModel;
  user: UserModel;
  isVisible: boolean;
}

export interface CreateTeacherDto extends Omit<TeacherModel, 'id'> {}

export interface UpdateTeacherDto extends Partial<Omit<TeacherModel, 'id'>> {}

export interface SelectTeacherDto extends Partial<TeacherModel> {}
