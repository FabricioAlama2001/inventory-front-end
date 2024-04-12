import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from "@services/core";
import { TransactionModel } from '@models/core/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesHttpService {
  private readonly httpClient = inject(HttpClient);
  private readonly API_URL = `${environment.API_URL}/expenses`;
  private readonly API_REPORTS_URL = `${environment.API_URL}/reports`;
  private readonly messageService = inject(MessageService) ;
  private readonly coreService = inject(CoreService);

  create(payload: TransactionModel): Observable<TransactionModel> {
    const url = this.API_URL;

    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );

  }

  findAll(): Observable<TransactionModel[]> {
    const url = this.API_URL;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  findTransactions(page: number = 0, search: string = ''): Observable<ServerResponse> {
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

  findOne(id: string): Observable<TransactionModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  update(id: string, payload: TransactionModel): Observable<TransactionModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<TransactionModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(transaction: TransactionModel[]): Observable<TransactionModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, transaction).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  downloadReport(id: string) {
    const url = `${this.API_REPORTS_URL}/expenses/${id}`;

    this.coreService.isProcessing = true;

    this.httpClient.get<BlobPart>(url, { responseType: 'blob' as 'json' })
      .subscribe(response => {
        const filePath = URL.createObjectURL(new Blob([response]));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', 'reporte_ingresos.pdf');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.coreService.isProcessing = false;
      });
  }
}
