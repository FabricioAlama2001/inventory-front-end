import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreateTeacherDto, TeacherDistributionModel, TeacherModel, UpdateTeacherDto} from '@models/core';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';

@Injectable({
  providedIn: 'root'
})
export class TeachersHttpService {
  API_URL = `${environment.API_URL}/teachers`;

  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateTeacherDto): Observable<TeacherModel> {
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
      .append('search', search);

    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  findOne(id: string): Observable<TeacherModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateTeacherDto): Observable<TeacherModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.isProcessing = true;
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.isProcessing = false;
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  reactivate(id: string): Observable<TeacherModel> {
    const url = `${this.API_URL}/${id}/reactivate`;

    return this.httpClient.put<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<TeacherModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.isProcessing = true;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.isProcessing = true;
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(teachers: TeacherModel[]): Observable<TeacherModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.isProcessing = true;
    return this.httpClient.patch<ServerResponse>(url, teachers).pipe(
      map((response) => {
        this.coreService.isProcessing = true;
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  hide(id: string): Observable<TeacherModel> {
    const url = `${this.API_URL}/${id}/hide`;

    return this.httpClient.put<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  findTeacherDistributionByTeacher(id: string, schoolPeriodId: string): Observable<TeacherDistributionModel[]> {
    const url = `${this.API_URL}/${id}/teacher-distributions`; //ruta del teacher distribucion
    let params = new HttpParams().append('schoolPeriodId', schoolPeriodId)

    return this.httpClient.get<ServerResponse>(url, {params}).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}
