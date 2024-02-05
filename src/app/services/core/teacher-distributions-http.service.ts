import {Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment } from '@env/environment';
import {Observable } from 'rxjs';
import {map } from 'rxjs/operators';
import {CreateTeacherDistributionDto, TeacherDistributionModel, UpdateTeacherDistributionDto } from '@models/core';
import {ServerResponse } from '@models/http-response';
import {CoreService, MessageService } from '@services/core';

@Injectable({
  providedIn: 'root'
})
export class TeacherDistributionsHttpService {
  API_URL = `${environment.API_URL}/teacher-distributions`;
  FILE_URL = `${environment.API_URL}/exports`;

  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService
    ) {
  }

  create(payload: CreateTeacherDistributionDto): Observable<TeacherDistributionModel> {
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

  findOne(id: string): Observable<TeacherDistributionModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateTeacherDistributionDto): Observable<TeacherDistributionModel> {
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


  remove(id: string): Observable<TeacherDistributionModel> {
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

  removeAll(payload: TeacherDistributionModel[]): Observable<TeacherDistributionModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  createMany(payload: CreateTeacherDistributionDto[]): Observable<TeacherDistributionModel[]> {
    const url = `${this.API_URL}/create-many`;

    this.coreService.isProcessing = true;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.isProcessing = false;
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  
//exportar excel

downloadFile(file: any) {
  const url = `${this.FILE_URL}/teacher-distributions`;
  this.httpClient.get<BlobPart>(url, {responseType: 'blob' as 'json'})
    .subscribe(response => {
      // const filePath = URL.createObjectURL(new Blob(binaryData, {type: file.extension}));
      const filePath = URL.createObjectURL(new Blob([response]));
      const downloadLink = document.createElement('a');
      downloadLink.href = filePath;
      downloadLink.setAttribute('download', 'teacher-distributions.xlsx');
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
}

}
