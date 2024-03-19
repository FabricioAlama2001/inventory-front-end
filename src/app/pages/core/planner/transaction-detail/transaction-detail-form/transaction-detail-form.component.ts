import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {
  CreateTransactionDetailDto,
  DocumentTypeModel,
  ProgrammingTypeModel,
  SubactivityModel,
  TransactionModel,
  UnitModel,
  UpdateTransactionDetailDto
} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  DocumentTypesHttpService,
  MessageService,
  ProgrammingTypesHttpService,
  RoutesService,
  SubactivitiesHttpService,
  TransactionDetailsHttpService,
  TransactionsHttpService,
  UnitsHttpService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
  TransactionDetailsFormEnum, RoutesEnum
} from "@shared/enums";
import {AuthService} from "@services/auth";


@Component({
  selector: 'app-transaction-detail-form',
  templateUrl: './transaction-detail-form.component.html',
  styleUrl: './transaction-detail-form.component.scss'
})
export class TransactionDetailFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly TransactionDetailsFormEnum = TransactionDetailsFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected documentTypes: DocumentTypeModel[] = [];
  protected programmingTypes: ProgrammingTypeModel[] = [];
  protected transactions: TransactionModel[] = [];
  protected subactivities: SubactivityModel[] = [];
  protected units: UnitModel[] = [];

  private saving: boolean = true;

  constructor(
    private readonly authService: AuthService,
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly transactionDetailsHttpService: TransactionDetailsHttpService,
    private readonly documentTypesHttpService: DocumentTypesHttpService,
    private readonly programmingTypesHttpService: ProgrammingTypesHttpService,
    private readonly subactivitiesHttpService: SubactivitiesHttpService,
    private readonly unitsHttpService: UnitsHttpService,
    private readonly transactionsHttpService: TransactionsHttpService,


  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.TRANSACTIONS, routerLink: [this.routesService.transactionsList]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if ((this.form.touched || this.form.dirty) && this.saving) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadDocumentTypes();
    this.loadprogrammingTypes();
    this.loadTransactions();
    this.loadSubactivities();
    this.loadUnits();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      amount: [null, [Validators.required]],
      advance: [null, [Validators.required]],
      cur: [null, [Validators.required]],
      goal: [null, [Validators.required]],
      date: [null, [Validators.required]],
      isIva: [true, [Validators.required]],
      enabled: [true, [Validators.required]],
      state: [true, [Validators.required]],
      process: [null, []],
      unit: [null, [Validators.required]],
      principalUnit: [null, []],
      documentType: [null, [Validators.required]],
      transaction: [null, [Validators.required]],
      subactivity: [null, [Validators.required]],
      programmingType: [null, [Validators.required]],
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.amountField.errors) this.formErrors.push(TransactionDetailsFormEnum.amount);
    if (this.advanceField.errors) this.formErrors.push(TransactionDetailsFormEnum.advance);
    if (this.curField.errors) this.formErrors.push(TransactionDetailsFormEnum.cur);
    if (this.goalField.errors) this.formErrors.push(TransactionDetailsFormEnum.goal);
    if (this.isIvaField.errors) this.formErrors.push(TransactionDetailsFormEnum.isIva);
    if (this.dateField.errors) this.formErrors.push(TransactionDetailsFormEnum.date);
    if (this.enabledField.errors) this.formErrors.push(TransactionDetailsFormEnum.enabled);
    if (this.stateField.errors) this.formErrors.push(TransactionDetailsFormEnum.state);
    if (this.documentTypeField.errors) this.formErrors.push(TransactionDetailsFormEnum.documentType);
    if (this.processField.errors) this.formErrors.push(TransactionDetailsFormEnum.process);
    if (this.unitField.errors) this.formErrors.push(TransactionDetailsFormEnum.unit);
    if (this.principalUnitField.errors) this.formErrors.push(TransactionDetailsFormEnum.principalUnit);
    if (this.transactionField.errors) this.formErrors.push(TransactionDetailsFormEnum.transaction);
    if (this.subactivityField.errors) this.formErrors.push(TransactionDetailsFormEnum.subactivity);
    if (this.programmingTypeField.errors) this.formErrors.push(TransactionDetailsFormEnum.programmingType);


    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.transactionDetailsHttpService.findOne(this.id!).subscribe((transactionDetail) => {
      this.form.patchValue(transactionDetail);
    });
  }

  onSubmit(): void {
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
  }

  back(): void {
    this.router.navigate([this.routesService.transactionDetailsList]);
  }

  create(transactionDetail: CreateTransactionDetailDto): void {
    this.transactionDetailsHttpService.create(transactionDetail).subscribe(transactionDetail => {
      //this.form.reset(transactionDetail);
      this.back();
    });
  }

  update(transactionDetail: UpdateTransactionDetailDto): void {
    this.transactionDetailsHttpService.update(this.id!, transactionDetail).subscribe((transactionDetail) => {
      //this.form.reset(transactionDetail);
      this.back()
    });
  }

  loadDocumentTypes(): void {
    this.documentTypesHttpService.findCatalogues().subscribe((documentTypes) => {
      this.documentTypes = documentTypes;
    });
  }

  loadprogrammingTypes(): void {
    this.programmingTypesHttpService.findCatalogues().subscribe((programmingTypes) => {
      this.programmingTypes = programmingTypes;
    });
  }

  loadTransactions(): void {
    this.transactionsHttpService.findCatalogues().subscribe((transactions) => {
      this.transactions = transactions;
    });
  }

  loadSubactivities(): void {
    this.subactivitiesHttpService.findCatalogues().subscribe((subactivities) => {
      this.subactivities = subactivities;
    });
  }

  loadUnits(): void {
    this.unitsHttpService.findCatalogues().subscribe((units) => {
      this.units = units;
    });
  }

  get amountField(): AbstractControl {
    return this.form.controls['amount'];
  }

  get advanceField(): AbstractControl {
    return this.form.controls['advance'];
  }

  get curField(): AbstractControl {
    return this.form.controls['cur'];
  }

  get goalField(): AbstractControl {
    return this.form.controls['goal'];
  }

  get dateField(): AbstractControl {
    return this.form.controls['date'];
  }

  get isIvaField(): AbstractControl {
    return this.form.controls['isIva'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get stateField(): AbstractControl {
    return this.form.controls['state'];
  }

  get documentTypeField(): AbstractControl {
    return this.form.controls['documentType'];
  }

  get processField(): AbstractControl {
    return this.form.controls['process'];
  }

  get transactionField(): AbstractControl {
    return this.form.controls['transaction'];
  }

  get subactivityField(): AbstractControl {
    return this.form.controls['subactivity'];
  }

  get programmingTypeField(): AbstractControl {
    return this.form.controls['programmingType'];
  }

  get unitField(): AbstractControl {
    return this.form.controls['unit'];
  }

  get principalUnitField(): AbstractControl {
    return this.form.controls['principalUnit'];
  }
}
