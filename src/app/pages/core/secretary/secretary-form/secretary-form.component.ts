import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnExitInterface } from '@shared/interfaces';
import { PrimeIcons } from "primeng/api";
import { MessageService, SecretaryService } from '@services/core';


@Component({
  selector: 'app-secretary-form',
  templateUrl: './secretary-form.component.html',
  styleUrls: ['./secretary-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecretaryFormComponent implements OnInit, OnExitInterface {
  protected readonly PrimeIcons = PrimeIcons;
  protected form: FormGroup;
  protected periodList = [
    {
      name: "DICIEMBRE 2021 - ABRIL 2022",
    },
    {
      name: "MAYO 2022 -  OCTUBRE 2021",
    },
    {
      name: "NOVIEMBRE 2022 -  MARZO 2023",

    }
  ];

  constructor(private secretaryService: SecretaryService,
    public messageService: MessageService, private formBuilder: FormBuilder) {

    this.form = this.newForm;

  }
  async onExit(): Promise<boolean> {
    if (this.form.touched && this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {

  }

  loadStates(): void {
    this.secretaryService.downloadPdfDocument()
      .subscribe((res) => {
        this.downloadPdf(res, "Solicitud matrícula")
      });
  }

  onSubmit(): void {
    if (this.form.valid) {

      /*  this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }*/
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields();
    }
  }

  downloadPdf(base64String: string, fileName: string) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
  }
  get identificationTypeField(): AbstractControl {
    return this.form.controls['period'];
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      identification: [{
        value: null,
        disabled: true
      }, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  get periodField(): AbstractControl {
    return this.form.controls['period'];
  }
}
