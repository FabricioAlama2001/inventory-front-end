
export interface DocumentTypeModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;

  code: string;
  name: string;
  description: string;
  acronym: string;
  enabled: boolean;

}

export interface CreateDocumentTypeDto extends Omit<DocumentTypeModel, 'id'> {}

export interface UpdateDocumentTypeDto extends Partial<Omit<DocumentTypeModel, 'id'>> {}

export interface SelectDocumentTypeDto extends Partial<DocumentTypeModel> {}

