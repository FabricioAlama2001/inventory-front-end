import {Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment } from '@env/environment';
import {Observable } from 'rxjs';
import {map } from 'rxjs/operators';
import { CreateGradeDto, GradeModel, UpdateGradeDto,  } from '@models/core';
import {ServerResponse } from '@models/http-response';
import {CoreService, MessageService } from '@services/core';

@Injectable({
  providedIn: 'root'
})
export class TeacherChargeHttpService {
  API_URL = `${environment.API_URL}/grades`;
  FILE_URL = `${environment.API_URL}/ `;

  constructor(private coreService: CoreService, private httpClient: HttpClient, private messageService: MessageService) {
  }

  create(payload: CreateGradeDto): Observable<GradeModel> {
    const url = `${this.API_URL}`;

    this.coreService.isProcessing = true;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.isProcessing = false;
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
      .append('search', search);

    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  findOne(id: string): Observable<GradeModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateGradeDto): Observable<GradeModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.isProcessing=true;
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.isProcessing=false;
        this.messageService.success(response);
        return response.data;
      })
    );
  }


  remove(id: string): Observable<GradeModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.isProcessing=true;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.isProcessing=false;
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(payload: GradeModel[]): Observable<GradeModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  export(){
    const url = `${this.FILE_URL}/notas`;

    return this.httpClient.get(url);
  }


}
