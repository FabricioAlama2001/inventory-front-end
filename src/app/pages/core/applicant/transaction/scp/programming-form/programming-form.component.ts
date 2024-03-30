import { FiscalYearModel } from './../../../../../../models/core/fiscal-year.model';
import { Component, inject, Input, OnInit } from '@angular/core';
import { OnExitInterface } from "@shared/interfaces";
import { Observable } from "rxjs";
import { UrlTree } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService, SubactivitiesHttpService } from "@services/core";
import { AuthService } from "@services/auth";
import { TreeNode } from "primeng/api";
import { SubactivityModel, TransactionModel } from "@models/core";
import { ClassButtonActionEnum, IconButtonActionEnum, LabelButtonActionEnum } from '@shared/enums';

@Component({
  selector: 'app-programming-form',
  templateUrl: './programming-form.component.html',
  styleUrl: './programming-form.component.scss'
})
export class ProgrammingFormComponent implements OnInit, OnExitInterface {
  @Input({ required: true }) subActivityId!: string;
  protected form: FormGroup;
  private saving: boolean = true;
  protected formErrors: string[] = [];
  protected transaction!: TransactionModel;
  protected subactivity!: SubactivityModel;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;

  private readonly authService = inject(AuthService);
  public readonly messageService = inject(MessageService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly subactivitiesHttpService = inject(SubactivitiesHttpService);

  constructor() {
    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if ((this.form.touched || this.form.dirty) && this.saving) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.findTransactionBySubactivity();
  }

  firstBimester = [
    {
      codificado_enero: 100, codificado_febrero: 150, codificado_marzo: 200,
      codificado_abril: 180, codificado_mayo: 220, codificado_junio: 250,
      certificate_enero: 80, certificate_febrero: 120, certificate_marzo: 150,
      certificate_abril: 130, certificate_mayo: 190, certificate_junio: 210
    }
  ];

  secondBimester = [
    {
      codificado_julio: 100, codificado_agosto: 150, codificado_septiembre: 200,
      codificado_octubre: 180, codificado_noviembre: 220, codificado_diciembre: 250,
      certificate_julio: 80, certificate_agosto: 120, certificate_marzo: 150,
      certificate_octubre: 130, certificate_noviembre: 190, certificate_diciembre: 210
    }
  ];

  get newForm(): FormGroup {
    return this.formBuilder.group({
      /*amount: [null, [Validators.required]],
      advance: [null],
      cur: [null],
      goal: [null],
      date: [new Date, [Validators.required]],
      isIva: [true, [Validators.required]],
      enabled: [true],
      state: [true],
      process: [null],
      unit: [this.transaction.unit.id, [Validators.required]],
      principalUnit: [null],
      documentType: [this.transaction.documentType.id, [Validators.required]],
      transaction: [this.transaction.id, [Validators.required]],
      subactivity: [this.subActivityId, [Validators.required]],
      programmingType: [null],*/
      fiscalYearId: [this.authService.fiscalYear.id, [Validators.required]],
    });
  }

  findTransactionBySubactivity() {
    this.subactivitiesHttpService.findTransactionBySubactivity(this.subActivityId, this.form.value).subscribe(transaction => {
      this.transaction = transaction;
      console.log(transaction);
      if (this.transaction.transactionDetails) {
        this.subactivity = this.transaction.transactionDetails[0].subactivity;
        console.log(this.subactivity);
      }
    });
  }

  /*onSubmit(): void {
    if (this.validateFormErrors) {
      this.saving = false;

      if (this.id === RoutesEnum.NEW) {
        this.create(this.form.value);
      } else {
        this.update(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }*/

  get isIvaField(): AbstractControl {
    return this.form.controls['isIva'];
  }
}
