import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {MessageService} from "@services/core";
import { CatalogueModel, CreatePndPoliceDto, PndPoliceModel, UpdatePndPoliceDto } from '@models/core';
import { CatalogueEnum } from '@shared/enums';

@Injectable({
  providedIn: 'root'
})
export class PndPolicesHttpService {
  API_URL = `${environment.API_URL}/pnd-polices`;

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
  }

  create(payload: CreatePndPoliceDto): Observable<PndPoliceModel> {
    const url = `${this.API_URL}`;

    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findAll(page: number = 0, search: string = ''): Observable<ServerResponse> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search)

    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  findOne(id: string): Observable<PndPoliceModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdatePndPoliceDto): Observable<PndPoliceModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  reactivate(id: string): Observable<PndPoliceModel> {
    const url = `${this.API_URL}/${id}/reactivate`;

    return this.httpClient.put<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<PndPoliceModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(projects: PndPoliceModel[]): Observable<PndPoliceModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, projects).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  suspend(id: string): Observable<PndPoliceModel> {
    const url = `${this.API_URL}/${id}/suspend`;

    return this.httpClient.put<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findCatalogue(name: CatalogueEnum): CatalogueModel[] {
    const catalogues: CatalogueModel[] = JSON.parse(String(sessionStorage.getItem('catalogues')));

    return catalogues.filter(catalogue => catalogue.name === name);
  }
}
