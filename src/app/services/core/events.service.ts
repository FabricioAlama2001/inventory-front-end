import {Injectable} from '@angular/core';
import {ModelI} from "@models/core";


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor() {
  }

  get model(): ModelI {
    return JSON.parse(String(sessionStorage.getItem('modelEvent')));
  }

  set model(value: ModelI) {
    sessionStorage.setItem('modelEvent', JSON.stringify(value));
  }
}
