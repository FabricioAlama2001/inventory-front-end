// import { HttpClient } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { environment } from '@env/environment';
// import { TransactionModel } from '@models/core/transaction.model';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class TransactionsService {
//   private readonly httpClient = inject(HttpClient);
//   private API_URL = `${environment.API_URL}/transactions`;

//   findAll(): Observable<TransactionModel> {
//     const url = this.API_URL;

//     return this.httpClient.get(url);
//   }

//   findOne(id: string): Observable<any> {
//     const url = `${this.API_URL}/${id}`;

//     return this.httpClient.get(url);
//   }

//   create(payload: any): Observable<any> {
//     const url = this.API_URL;

//     return this.httpClient.post(url, payload);
//   }

//   update(id: string, payload: any): Observable<any> {
//     const url = `${this.API_URL}/${id}`;

//     return this.httpClient.put(url, payload);
//   }

//   remove(id: string): Observable<any> {
//     const url = `${this.API_URL}/${id}`;

//     return this.httpClient.delete(url);
//   }
// }
