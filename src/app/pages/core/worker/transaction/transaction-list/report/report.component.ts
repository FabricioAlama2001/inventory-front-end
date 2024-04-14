import {Component, inject} from '@angular/core';
import {FormControl} from "@angular/forms";
import {PrimeIcons} from "primeng/api";
import {IncomesHttpService} from "@services/core";
import {format} from "date-fns";
import {es} from "date-fns/locale";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {
  private readonly incomesHttpService = inject(IncomesHttpService);
  protected startedAt: FormControl = new FormControl<Date>(new Date());
  protected endedAt: FormControl = new FormControl<Date>(new Date());
  protected readonly PrimeIcons = PrimeIcons;

  downloadPdfReport() {
    const startedAt = `${this.startedAt.value.getFullYear()}-${this.startedAt.value.getMonth()+1}-${this.startedAt.value.getDate()}`;
    const endedAt = `${this.endedAt.value.getFullYear()}-${this.endedAt.value.getMonth()+1}-${this.endedAt.value.getDate()}`;

    this.incomesHttpService.downloadPdfReport(startedAt,endedAt);
  }

  protected readonly format = format;
  protected readonly es = es;
}
