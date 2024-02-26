import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreateIndicatorComponentDto, UpdateIndicatorComponentDto, IndicatorComponentModel} from '@models/core';
import {ServerResponse} from '@models/http-response';
import {MessageService} from "@services/core";


@Injectable({
  providedIn: 'root'
})
export class IndicatorComponentsHttpService {
  API_URL = `${environment.API_URL}/core/indicator-components`;

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
  }

  create(payload: CreateIndicatorComponentDto): Observable<IndicatorComponentModel> {
    const url = `${this.API_URL}`;

    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findAll(): Observable<IndicatorComponentModel[]> {
    const url = this.API_URL;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  findIndicatorComponents(page: number = 0, search: string = ''): Observable<IndicatorComponentModel[]> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search)

    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<IndicatorComponentModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateIndicatorComponentDto): Observable<IndicatorComponentModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  enable(id: string): Observable<IndicatorComponentModel> {
    const url = `${this.API_URL}/${id}/enable`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<IndicatorComponentModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(indicatorComponents: IndicatorComponentModel[]): Observable<IndicatorComponentModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, indicatorComponents).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  disable(id: string): Observable<IndicatorComponentModel> {
    const url = `${this.API_URL}/${id}/disable`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findCatalogues(): Observable<IndicatorComponentModel[]> {
    const url = `${this.API_URL}/catalogues`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }
}
