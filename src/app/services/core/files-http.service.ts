import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MessageService as MessageServicePn} from 'primeng/api';
import {EventModel, FileModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CoreMessageEnum} from "@shared/enums";

@Injectable({
  providedIn: 'root'
})
export class FilesHttpService {
  API_URL = `${environment.API_URL}/files`;

  constructor(private messageServicePn: MessageServicePn,
              private coreService: CoreService, private httpClient: HttpClient,
              private messageService: MessageService) {
  }

  findByModel(modelId: string, page: number = 0, search: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/models/${modelId}`;

    const headers = new HttpHeaders().append('pagination', 'true');

    const params = new HttpParams()
      .append('page', page.toString())
      .append('limit', '20')
      .append('search', search);

    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  findOne(id: string): Observable<EventModel> {
    const url = `${this.API_URL}/${id}`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  uploadFile(modelId: string, typeId: string, payload: FormData): Observable<EventModel> {
    const url = `${this.API_URL}/${modelId}/upload?typeId=${typeId}`;

    this.coreService.isProcessing = true;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.isProcessing = false;
        this.messageServicePn.clear();
        this.messageServicePn.add({
          key: CoreMessageEnum.APP_TOAST,
          severity: 'info',
          summary: response.title,
          detail: response.message
        });
        return response.data;
      })
    );
  }

  uploadImage(modelId: string, payload: FormData): Observable<EventModel> {
    const url = `${this.API_URL}/${modelId}/upload-image`;

    this.coreService.isProcessing = true;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.isProcessing = false;
        this.messageServicePn.clear();
        this.messageServicePn.add({
          key: CoreMessageEnum.APP_TOAST,
          severity: 'info',
          summary: response.title,
          detail: response.message
        });
        return response.data;
      })
    );
  }

  uploadFiles(modelId: string, payload: FormData): Observable<EventModel> {
    const url = `${this.API_URL}/${modelId}/uploads`;

    this.coreService.isProcessing = true;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.isProcessing = false;
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  reactivate(id: string): Observable<EventModel> {
    const url = `${this.API_URL}/${id}/reactivate`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<FileModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.isProcessing = true;

    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.messageServicePn.clear();

        this.messageServicePn.add({
          key: CoreMessageEnum.APP_TOAST,
          severity: 'info',
          summary: response.title,
          detail: response.message
        });
        this.coreService.isProcessing = false;
        return response.data;
      })
    );
  }

  removeAll(payload: EventModel[]): Observable<EventModel[]> {
    const url = `${this.API_URL}/remove-all`;

    return this.httpClient.patch<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  hide(id: string): Observable<EventModel> {
    const url = `${this.API_URL}/${id}/hide`;

    return this.httpClient.patch<ServerResponse>(url, null).pipe(
      map((response) => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  downloadFile(file: FileModel) {
    const url = `${this.API_URL}/${file.id}/download`;
    this.coreService.isProcessing = true;
    this.httpClient.get<BlobPart>(url, {responseType: 'blob' as 'json'})
      .subscribe(response => {
        // const filePath = URL.createObjectURL(new Blob(binaryData, {type: file.extension}));
        const filePath = URL.createObjectURL(new Blob([response]));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', file.originalName!);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.coreService.isProcessing = false;
      });
  }
}
