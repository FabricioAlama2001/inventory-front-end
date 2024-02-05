import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {CreateUserDto, UpdateUserDto, UserModel} from '@models/auth';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {MessageService} from '@services/core';
import {CatalogueTypeEnum} from "@shared/enums";
import {LocationModel} from "@models/core";

@Injectable({
  providedIn: 'root'
})
export class LocationsHttpService {
  API_URL = `${environment.API_URL}/locations`;

  constructor(private httpClient: HttpClient,
              private messageService: MessageService) {
  }

  create(payload: CreateUserDto): Observable<UserModel> {
    const url = `${this.API_URL}`;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findAll(page: number = 1, search: string = ''): Observable<LocationModel[]> {
    const url = this.API_URL;
    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams().append('page', page).append('search', search);

    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map(response => {
        // if (response.pagination) {
        //   this.pagination.next(response.pagination);
        // }
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<UserModel> {
    const url = `${this.API_URL}/${id}`;
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => response.data)
    );
  }

  update(id: string, payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL}/${id}`;
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<boolean> {
    const url = `${this.API_URL}/${id}`;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(id: LocationModel[]): Observable<boolean> {
    const url = `${this.API_URL}/${id}`;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findCache(): Observable<boolean> {
    const url = `${this.API_URL}/cache/get`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        sessionStorage.setItem('locations', JSON.stringify(response.data));
        return true;
      })
    );
  }

  findCountries(): LocationModel[] {
    const locations: LocationModel[] = JSON.parse(String(sessionStorage.getItem('locations')));

    return locations.filter(location => location.level === 1);
  }

  findProvincesByCountry(countryId: string): LocationModel[] {
    const locations: LocationModel[] = JSON.parse(String(sessionStorage.getItem('locations')));

    return locations.filter(location => location.level === 2 && location.parentId === countryId);
  }

  findCantonsByProvince(provinceId: string): LocationModel[] {
    const locations: LocationModel[] = JSON.parse(String(sessionStorage.getItem('locations')));

    return locations.filter(location => location.level === 3 && location.parentId === provinceId);
  }

  findParishesByCanton(cantonId: string): LocationModel[] {
    const locations: LocationModel[] = JSON.parse(String(sessionStorage.getItem('locations')));

    return locations.filter(location => location.level === 4 && location.parentId === cantonId);
  }
}
