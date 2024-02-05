import {Component, EventEmitter, Output} from '@angular/core';
import {CoreService, EnrollmentsHttpService, FilesHttpService, StudentsHttpService} from "@services/core";
import {PrimeIcons} from "primeng/api";
import {CatalogueEnrollmentStateEnum, SkeletonEnum} from "@shared/enums";
import {AuthService} from "@services/auth";
import {StudentModel} from "@models/core";

@Component({
  selector: 'app-application-report',
  templateUrl: './application-report.component.html',
  styleUrls: ['./application-report.component.scss']
})
export class ApplicationReportComponent {
  @Output() nextOut: EventEmitter<number> = new EventEmitter<number>();
  @Output() previousOut: EventEmitter<number> = new EventEmitter<number>();
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected pdfSrc: string = '';
  protected pdf!: Blob;
  protected isLoadingPdf: boolean = false;
  protected student!: StudentModel;

  constructor(private readonly filesHttpService: FilesHttpService,
              protected readonly coreService: CoreService,
              private readonly authService: AuthService,
              private readonly studentsHttpService: StudentsHttpService,
              private readonly enrollmentsHttpService: EnrollmentsHttpService
  ) {
    this.student = authService.auth.student;
    this.findEnrollmentByStudent();
  }

  findEnrollmentByStudent() {
    this.studentsHttpService.findEnrollmentByStudent(this.student.id)
      .subscribe(enrollment => {
        this.generateEnrollmentCertificate(enrollment.id);
      });
  }

  generateEnrollmentCertificate(id:string) {
    this.isLoadingPdf = false;
    this.enrollmentsHttpService.generateEnrollmentApllication(id).subscribe(pdf => {
      this.pdf = pdf;
      const reader = new FileReader();
      reader.readAsDataURL(pdf);
      reader.onloadend = () => {
        if (typeof reader.result === 'string')
          this.pdfSrc = reader.result;
        this.isLoadingPdf = true;
      }
    });
  }

  download() {
    const filePath = URL.createObjectURL(new Blob([this.pdf]));
    const downloadLink = document.createElement('a');
    downloadLink.href = filePath;
    const fileName = 'Ficha_Socioeconomica_' + this.authService.auth.identification;
    downloadLink.setAttribute('download', fileName + '.pdf');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  previous() {
    this.previousOut.emit(-1);
  }

  next() {
    this.nextOut.emit(1);
  }
}
