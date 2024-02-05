import {CatalogueModel} from "@models/core/catalogue.model";

export interface FileModel {
    id?: string;
    name?: string;
    fullName?: string;
    fullPath?: string;
    description?: string;
    extension?: string;
    directory?: string;
    originalName?: string;
    type?: CatalogueModel;
}
