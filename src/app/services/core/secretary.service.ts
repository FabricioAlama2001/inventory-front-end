import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {CoreService, MessageService} from "@services/core";

import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
@Injectable({
  providedIn: 'root'
})
export class SecretaryService {

  API_URL = `${environment.API_URL}/secretary`;

  constructor(
              private httpClient: HttpClient,
              private messageService: MessageService) {
  }

  downloadPdfDocument(): Observable<any> {
    const url = `${this.API_URL}/pdf/download`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }
}
