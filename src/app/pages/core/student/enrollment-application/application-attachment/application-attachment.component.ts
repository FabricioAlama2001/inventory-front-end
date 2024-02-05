import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  CataloguesHttpService, CoreService,
  EnrollmentsHttpService, FilesHttpService,
  MessageService,
  StudentsHttpService,
} from "@services/core";
import {CatalogueModel, ColumnModel, EnrollmentModel, FileModel} from "@models/core";
import {
  BreadcrumbEnum,
  CatalogueEnrollmentStateEnum,
  CatalogueTypeEnum, LabelButtonActionEnum, SkeletonEnum
} from "@shared/enums";
import {AuthService} from "@services/auth";
import {PrimeIcons} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-application-attachment',
  templateUrl: './application-attachment.component.html',
  styleUrls: ['./application-attachment.component.scss']
})
export class ApplicationAttachmentComponent implements OnInit {
  @Output() previousOut: EventEmitter<number> = new EventEmitter<number>();
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly SkeletonEnum = SkeletonEnum;

// Flag upload files is enabled
  protected isFileList: boolean = false;
  protected enabled: boolean = false;
  protected isOldStudent: boolean = false;
  protected fileTypes: CatalogueModel[] = [];
  protected enrollment!: EnrollmentModel;
  protected files: FileModel[] = [];
  protected uploadedFiles: boolean = false;
  protected formErrors: string[] = [];
  protected columns: ColumnModel[] = this.buildColumns;
  protected columnsRequirement: ColumnModel[] = this.buildColumnsRequirement;

  constructor(
    private readonly authService: AuthService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    private readonly enrollmentsHttpService: EnrollmentsHttpService,
    private readonly studentsHttpService: StudentsHttpService,
    protected readonly messageService: MessageService,
    public readonly filesHttpService: FilesHttpService,
    private readonly cataloguesHttpService: CataloguesHttpService,) {
  }

  ngOnInit(): void {
    this.findEnrollmentByStudent();
    this.findEnrollmentDetailByStudent();
  }

  /** Build Data **/
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Requisito'},
      {field: 'required', header: 'Obligatorio'}
    ];
  }

  get buildColumnsRequirement(): ColumnModel[] {
    return [
      {field: 'type', header: 'Requisito'},
      {field: 'originalName', header: 'Archivo'}
    ];
  }

  findEnrollmentByStudent() {
    this.studentsHttpService.findEnrollmentByStudent(this.authService.auth.student.id).subscribe(enrollment => {
      this.enrollment = enrollment;

      this.enabled = this.enrollment?.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REGISTERED
        || this.enrollment?.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REJECTED;

      this.findFilesByModel();
    })
  }

  findEnrollmentDetailByStudent() {
    this.studentsHttpService.findEnrollmentDetailsByStudent(this.authService.auth.student.id)
      .subscribe(enrollmentDetails => {
        this.isOldStudent = enrollmentDetails.some(enrollmentDetail => {
          return enrollmentDetail.enrollmentDetailState.state.code === CatalogueEnrollmentStateEnum.ENROLLED;
        });

        this.loadFileTypes();
      });
  }

  findFilesByModel(page: number = 0) {
    this.uploadedFiles = false;
    this.filesHttpService.findByModel(this.enrollment.id, 0, '')
      .subscribe((response) => {
        this.files = response.data;

        this.files.forEach(file => {
          this.fileTypes = this.fileTypes.filter(fileType => {
            return fileType.id != file.type?.id
          });
        });

        this.uploadedFiles = true;
      });
  }

  loadFileTypes(): void {
    if (this.isOldStudent) {
      this.fileTypes = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_OLD_STUDENT);
    } else {
      this.fileTypes = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_NEW_STUDENT);
    }
  }

  sendRequest() {
    if (this.validateForm()) {
      this.messageService.questionCustom('¿Está seguro de enviar la solicitud?', 'No podrá realizar cambios después de enviar la solicitud')
        .then((result) => {
          if (result.isConfirmed) {
            this.enrollmentsHttpService.sendRequest(this.enrollment.id, {schoolPeriod:this.enrollment.schoolPeriod}).subscribe(() => {
              this.findEnrollmentByStudent();
              window.location.reload();
            });
          }
        });
    } else {
      this.messageService.errorsFields(this.formErrors);
    }
  }

  uploadFile() {
    this.isFileList = true;
  }

  download(file: FileModel) {
    this.filesHttpService.downloadFile(file);
  }

  removeFile(file: FileModel) {
    if (file?.id)
      this.filesHttpService.remove(file.id).subscribe(() => {
        this.loadFileTypes();
        this.findFilesByModel();
      });
  }

  validateForm() {
    this.formErrors = [];
    this.fileTypes.forEach(fileType => {
      if (fileType.required) {
        this.formErrors.push(fileType.name);
      }
    });

    this.formErrors.sort();
    return this.formErrors.length === 0;
  }

  previous() {
    this.previousOut.emit(-1);
  }
}
