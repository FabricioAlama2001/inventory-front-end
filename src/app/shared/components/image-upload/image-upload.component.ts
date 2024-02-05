import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PrimeIcons} from "primeng/api";
import {FilesHttpService} from "@services/core";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  @Input() acceptAttributes = 'image/*';
  @Input() multiple = true;
  @Input() maxFileSize = 10240000 * 20;
  @Input() fileLimit = 1;
  @Input() modelId: string = '';
  @Output() flagUploadFiles: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  protected readonly PrimeIcons = PrimeIcons;

  constructor(private filesHttpService: FilesHttpService) {
  }

  uploadFile(event: any, uploadFiles: any) {
    const formData = new FormData();
    formData.append('file', event.files[0]);
    this.filesHttpService.uploadImage(this.modelId, formData).subscribe(response => {
      this.flagUploadFiles.emit(true);
      uploadFiles.clear();
    }, error => uploadFiles.clear());
  }
}
