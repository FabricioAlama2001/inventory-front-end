import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreateExpenseGroupDto, UpdateExpenseGroupDto, ExpenseGroupModel} from '@models/core';
import {ServerResponse} from '@models/http-response';
import {MessageService} from "@services/core";
import { CatalogueEnum } from '@shared/enums';
import { CatalogueModel } from '@models/core';

@Injectable({
  providedIn: 'root'
})
export class ExpenseGroupsHttpService {
  API_URL = `${environment.API_URL}/core/expense-groups`;

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
  }

  create(payload: CreateExpenseGroupDto): Observable<ExpenseGroupModel> {
    const url = `${this.API_URL}`;

    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findExpenseGroups(page: number = 0, search: string = ''): Observable<ExpenseGroupModel[]> {
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

  findOne(id: string): Observable<ExpenseGroupModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateExpenseGroupDto): Observable<ExpenseGroupModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  enable(id: string): Observable<ExpenseGroupModel> {
    const url = `${this.API_URL}/${id}/enable`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<ExpenseGroupModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(expenseGroups: ExpenseGroupModel[]): Observable<ExpenseGroupModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, expenseGroups).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  disable(id: string): Observable<ExpenseGroupModel> {
    const url = `${this.API_URL}/${id}/disable`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findCatalogue(type: CatalogueEnum): CatalogueModel[] {
    const catalogues: CatalogueModel[] = JSON.parse(String(sessionStorage.getItem('catalogues')));

    return catalogues.filter(catalogue => catalogue.type === type);
  }
}
