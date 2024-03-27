import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  CreateSubactivityDto,
  UpdateSubactivityDto,
  SubactivityModel,
  ProjectModel,
  TransactionModel
} from '@models/core';
import {ServerResponse} from '@models/http-response';
import {MessageService} from "@services/core";

@Injectable({
  providedIn: 'root'
})
export class SubactivitiesHttpService {
  API_URL = `${environment.API_URL}/core/subactivities`;

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
  }

  create(payload: CreateSubactivityDto): Observable<SubactivityModel> {
    const url = `${this.API_URL}`;

    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findAll(): Observable<SubactivityModel[]> {
    const url = this.API_URL;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  findSubactivities(page: number = 0, search: string = ''): Observable<ServerResponse> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search);

    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  findOne(id: string): Observable<SubactivityModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateSubactivityDto): Observable<SubactivityModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  enable(id: string): Observable<SubactivityModel> {
    const url = `${this.API_URL}/${id}/enable`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<SubactivityModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(subactivities: SubactivityModel[]): Observable<SubactivityModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, subactivities).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  disable(id: string): Observable<SubactivityModel> {
    const url = `${this.API_URL}/${id}/disable`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findCatalogues(): Observable<SubactivityModel[]> {
    const url = `${this.API_URL}/catalogues`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  findSubactivitiesByExpenseType(expenseTypeId: string, payload: any): Observable<ProjectModel[]> {
    const url = `${this.API_URL}/expense-types/${expenseTypeId}`;

    const params = new HttpParams().append('unitId', payload.unit.id);
    return this.httpClient.get<ServerResponse>(url,{params}).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  findTransactionBySubactivity(subactivityId: string, payload: any): Observable<TransactionModel> {
    const url = `${this.API_URL}/${subactivityId}/transactions`;

    const params = new HttpParams().append('fiscalYearId', payload.fiscalYearId);

    return this.httpClient.get<ServerResponse>(url,{params}).pipe(
      map(response => {
        return response.data;
      })
    );
  }
}
