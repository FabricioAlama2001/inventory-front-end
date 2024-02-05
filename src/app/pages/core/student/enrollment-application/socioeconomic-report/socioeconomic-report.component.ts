import {Component, EventEmitter, Output} from '@angular/core';
import {CoreService, FilesHttpService, StudentsHttpService} from "@services/core";
import {AuthService} from "@services/auth";
import {PrimeIcons} from "primeng/api";
import {SkeletonEnum} from "@shared/enums";

@Component({
  selector: 'app-socioeconomic-report',
  templateUrl: './socioeconomic-report.component.html',
  styleUrls: ['./socioeconomic-report.component.scss']
})
export class SocioeconomicReportComponent {
  @Output() nextOut: EventEmitter<number> = new EventEmitter<number>();
  @Output() previousOut: EventEmitter<number> = new EventEmitter<number>();
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected pdfSrc: string = '';
  protected pdf!: Blob;
  protected isLoadingPdf: boolean = false;

  constructor(private readonly filesHttpService: FilesHttpService,
              protected readonly coreService: CoreService,
              private readonly authService: AuthService,
              private readonly studentsHttpService: StudentsHttpService
  ) {
    this.generateSocioeconomicForm();
  }

  generateSocioeconomicForm() {
    this.isLoadingPdf = false;
    this.studentsHttpService.generateSocioeconomicForm(this.authService.auth.student.id).subscribe(pdf => {
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
