import {UserModel} from "@models/auth";

export interface SignatureModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  authorizer: UserModel;
  dispatcher: UserModel;
  receiver: UserModel;
}
