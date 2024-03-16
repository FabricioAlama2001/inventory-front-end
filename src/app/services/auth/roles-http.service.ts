import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreateRoleDto, RoleModel, UpdateRoleDto} from '@models/auth';
import {PaginatorModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';

@Injectable({
  providedIn: 'root'
})
export class RolesHttpService {
  API_URL = `${environment.API_URL}/roles`;

  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateRoleDto): Observable<RoleModel> {
    const url = `${this.API_URL}`;


    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {

        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findAll(page: number = 0, search: string = ''): Observable<RoleModel[]> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search);


    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {

        // if (response.pagination) {
        //   this.pagination.next(response.pagination);
        // }
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<RoleModel> {
    const url = `${this.API_URL}/${id}`;


    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {

        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateRoleDto): Observable<RoleModel> {
    const url = `${this.API_URL}/${id}`;


    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {

        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<RoleModel> {
    const url = `${this.API_URL}/${id}`;


    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {

        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(roles: RoleModel[]): Observable<RoleModel[]> {
    const url = `${this.API_URL}/remove-all`;


    return this.httpClient.patch<ServerResponse>(url, roles).pipe(
      map((response) => {

        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findCatalogues(): Observable<RoleModel[]> {
    const url = `${this.API_URL}/catalogues`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }
}
