import {Component, Input, OnInit, inject, Output, EventEmitter} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TransactionDetailModel} from '@models/core/transaction-detail.model';
import {BreadcrumbService, CoreService, MessageService, ProductsHttpService, RoutesService} from '@services/core';
import {TransactionDetailsHttpService} from '@services/core/transaction-details-http.service';
import {
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum
} from '@shared/enums';
import {PrimeIcons} from 'primeng/api';
import {ProductModel} from "@models/core";
import {IncomeModel} from "@models/core/income.model";

@Component({
  selector: 'app-transaction-detail-form',
  templateUrl: './transaction-detail-form.component.html',
  styleUrl: './transaction-detail-form.component.scss'
})
export class TransactionDetailFormComponent implements OnInit {
  private readonly productsHttpService = inject(ProductsHttpService);
  private readonly formBuilder = inject(FormBuilder); //Ayuda a crear - Formulario Reactivos
  protected readonly coreService = inject(CoreService); //Funcionalidades Generalidades que se utilizan en todos los componente
  protected readonly messageService = inject(MessageService); //

  @Input() id!: string;
  @Input() transactionId!: string;
  @Input() isEditing: boolean = false;
  @Input() isIncome: boolean = false;
  @Input() transactionDetail!: TransactionDetailModel;
  @Output() transactionDetailFormOut = new EventEmitter<TransactionDetailModel>();
  protected form!: FormGroup;
  protected formErrors!: string[];
  protected transaction!: any[];
  protected products!: ProductModel[];

  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;

  constructor() {
    this.form = this.buildForm;

    this.checkValueChanges();
  }

  ngOnInit(): void {
    this.loadProduct();

    if (this.isEditing) {
      this.form.patchValue(this.transactionDetail);
    }
  }

  loadProduct() {
    this.productsHttpService.findCatalogues().subscribe((products) => {
      if (this.isEditing) {
        this.products = [this.productField.value];
      } else {
        this.products = products;
      }
    });
  }

  get buildForm() {
    return this.formBuilder.group({
      observation: [null],
      quantity: [{value: null, disabled: true}],
      product: ['', Validators.required],
    });
  }

  checkValueChanges() {
    this.productField.valueChanges.subscribe(value => {
      if (value) {
        this.quantityField.enable();

        if (!this.isIncome) {
          if (this.productField.value.stock == 0) {
            this.quantityField.setValue(null);
            this.quantityField.setValidators([Validators.min(1), Validators.max(0)]);
          } else {
            this.quantityField.setValidators([Validators.required, Validators.min(1), Validators.max(this.productField.value.stock)]);
          }
        }else{
          this.quantityField.setValidators([Validators.required,Validators.min(1)]);
        }

        this.quantityField.updateValueAndValidity();
      }
    });
  }

  add(): void {
    if (this.form.valid) {
      this.transactionDetailFormOut.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  get observationField(): AbstractControl {
    return this.form.controls['observation'];
  }

  get quantityField(): AbstractControl {
    return this.form.controls['quantity'];
  }

  get productField(): AbstractControl {
    return this.form.controls['product'];
  }
}

