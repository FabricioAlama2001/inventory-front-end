import { Component, Input, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionDetailModel } from '@models/core/transaction-detail.model';
import { BreadcrumbService, CoreService, MessageService, RoutesService } from '@services/core';
import { TransactionDetailsHttpService } from '@services/core/transaction-details-http.service';
import { BreadcrumbEnum, ClassButtonActionEnum, IconButtonActionEnum, LabelButtonActionEnum, SkeletonEnum } from '@shared/enums';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-transaction-detail-form',
  templateUrl: './transaction-detail-form.component.html',
  styleUrl: './transaction-detail-form.component.scss'
})
export class TransactionDetailFormComponent {


  private readonly transactionDetailsHttpService= inject(TransactionDetailsHttpService);
  private readonly breadcrumbService = inject(BreadcrumbService); //
  private readonly formBuilder = inject(FormBuilder); //Ayuda a crear - Formulario Reactivos
  private readonly router = inject(Router); //Redireccionar
  private readonly routesService = inject(RoutesService); //Ruta de la aplicacion
  protected readonly coreService = inject(CoreService); //Funcionalidades Generalidades que se utilizan en todos los componente
  protected readonly messageService = inject(MessageService); //

  @Input() id!: string;
  protected form!: FormGroup;
  protected formErrors!: string[];
  protected transaction!: any[];

  
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;

  
  protected helpText!: string;
  private saving: boolean = true;

  constructor(){
    this.breadcrumbService.setItems([
      {
        label: BreadcrumbEnum.TRANSACTION_DETAILS,
        routerLink: [this.routesService.transactionDetailsList],
      },
      {
        label: BreadcrumbEnum.FORM,
      },
    ]);

    this.form = this.buildForm;
    this.checkValueChanges();
  }

  //Este metodo Construir el formulario reactivo
  get buildForm() {
    return this.formBuilder.group({
      observation: ['', Validators.required],
      quantity: ['', Validators.required],
    });
}
checkValueChanges() {}



back(): void {
  this.router.navigate([this.routesService.transactionDetailsList]);
}



create(payload: TransactionDetailModel): void {
  this.transactionDetailsHttpService.create(payload).subscribe((applicationStatus) => {
    this.saving = false;
    this.back();
  });
}

update(payload: TransactionDetailModel): void {
  this.transactionDetailsHttpService
    .update(this.id!, payload)
    .subscribe((applicationStatus) => {
      this.saving = false;
      this.back();
    });
  }

get observationField(): AbstractControl {
  return this.form.controls['observation'];
}
get quantityField(): AbstractControl {
  return this.form.controls['quantity'];
}

}

