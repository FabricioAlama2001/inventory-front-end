import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PrimeIcons} from "primeng/api";
import {FilesHttpService, MessageService} from "@services/core";
import {CatalogueModel} from "@models/core";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() acceptAttributes = '.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar,.7z,.tar, image/*';
  @Input() auto = true;
  @Input() multiple = true;
  @Input() maxFileSize = 10240000 * 20;
  @Input() fileLimit = 20;
  @Input() mode:'basic'|'advanced'|undefined = 'basic';
  @Input() modelId: string = '';
  @Output() flagUploadFiles: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Input() types: CatalogueModel[] = [];
  @Output() selectedType: EventEmitter<CatalogueModel> = new EventEmitter<CatalogueModel>();
  @Input() typeId!: string;
  protected readonly PrimeIcons = PrimeIcons;
  protected type: FormControl = new FormControl<any>(null);

  constructor(private filesHttpService: FilesHttpService, protected messageService: MessageService) {
  }

  uploadFile(event: any, uploadFiles: any) {
    if (this.typeId) {
      const formData = new FormData();
      formData.append('file', event.files[0]);

      this.filesHttpService.uploadFile(this.modelId, this.typeId, formData).subscribe(response => {
        this.flagUploadFiles.emit(true);
        uploadFiles.clear();
      }, error => uploadFiles.clear());
    } else if (this.type.value) {
      const formData = new FormData();
      formData.append('file', event.files[0]);

      this.filesHttpService.uploadFile(this.modelId, this.type.value.id, formData).subscribe(response => {
        this.flagUploadFiles.emit(true);
        uploadFiles.clear();
      }, error => uploadFiles.clear());
    } else {
      this.messageService.errorCustom('Seleccione un tipo de documento', 'Intente de nuevo por favor');
    }
  }

  uploadFiles(event: any, uploadFiles: any) {
    const formData = new FormData();
    formData.append('files[]', event.files);
    formData.append('typeId', 'hola');

    this.filesHttpService.uploadFiles(this.modelId, formData).subscribe(response => {
      this.flagUploadFiles.emit(false);
      uploadFiles.clear();
    }, error => uploadFiles.clear());
  }
}
