export interface LocationModel {
  id?: string;
  parent?: LocationModel;
  parentId?: string;
  continentId?: string;
  alpha2Code?: string;
  alpha3Code?: string;
  callingCode?: string;
  code?: string;
  flag?: string;
  latitude?: number;
  longitude?: number;
  level?:number;
  name?: string;
  zone?: string;
}
