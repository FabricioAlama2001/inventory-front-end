import {CatalogueModel} from '@models/core';
export interface EventModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;
  enabled: boolean;

  state: CatalogueModel;
  schoolPeriod: CatalogueModel;

  description: string;
  startedAt: Date;
  endedAt: Date;
  name: string;
  order: number;
}

export interface CreateEventDto extends Omit<EventModel, 'id'> {
}

export interface UpdateEventDto extends Partial<Omit<EventModel, 'id'>> {
}

export interface SelectEventDto extends Partial<EventModel> {
}
