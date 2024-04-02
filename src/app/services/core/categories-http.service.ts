import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {MessageService} from '@services/core';
import {CategoryModel} from '@models/core';

@Injectable({
  providedIn: 'root',
})
export class CategoriesHttpService {
  private readonly API_URL = `${environment.API_URL}/categories`;
  private readonly httpClient = inject(HttpClient);
  private readonly messageService = inject (MessageService);

  findCatalogues(): Observable<CategoryModel[]> {
    const url = `${this.API_URL}/catalogues`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(reponse =>{
        return reponse.data;
      })
    );
  }

  findAll(): Observable<CategoryModel[]> {
    const url = this.API_URL;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(reponse =>{
        return reponse.data;
      })
    );
  }

  findOne(id: string): Observable<CategoryModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => response.data)
    );
  }

  create(payload: CategoryModel): Observable<CategoryModel> {
    const url = this.API_URL;

    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(reponse => {
      this.messageService.success(reponse);
      return reponse.data;
    })
    );
  }

  update(id: string, payload: CategoryModel): Observable<CategoryModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<CategoryModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.delete<ServerResponse>(url).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  enable(id: string): Observable<CategoryModel> {
    const url = `${this.API_URL}/${id}/enable`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  disable(id: string): Observable<CategoryModel> {
    const url = `${this.API_URL}/${id}/disable`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }
}
