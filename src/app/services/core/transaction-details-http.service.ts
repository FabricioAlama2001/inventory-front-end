import { ProductModel } from './../../models/core/product.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerResponse } from '@models/http-response';
import { MessageService } from "@services/core";
import { TransactionDetailModel } from '@models/core/transaction-detail.model';


@Injectable({
  providedIn: 'root'
})
export class TransactionDetailsHttpService {
  private readonly httpClient = inject(HttpClient);
  private API_URL = `${environment.API_URL}/transaction-details`;
  private messageService = inject(MessageService);

  create(payload: TransactionDetailModel): Observable<TransactionDetailModel> {
    const url = `${this.API_URL}`;

    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findAll(): Observable<TransactionDetailModel[]> {
    const url = this.API_URL;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  findTransactionDetails(page: number = 0, search: string = ''): Observable<ServerResponse> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search);

    return this.httpClient.get<ServerResponse>(url, { headers, params }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  findOne(id: string): Observable<TransactionDetailModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  update(id: string, payload: TransactionDetailModel): Observable<TransactionDetailModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<TransactionDetailModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(transactionDetail: TransactionDetailModel[]): Observable<TransactionDetailModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, transactionDetail).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  
}
