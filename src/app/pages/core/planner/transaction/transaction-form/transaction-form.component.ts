import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {
  ApplicationStatusModel,
  CreateTransactionDto,
  DocumentTypeModel,
  FiscalYearModel,
  TransactionModel,
  UnitModel,
  UpdateTransactionDto
} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  DocumentTypesHttpService,
  FiscalYearsHttpService,
  MessageService,
  RoutesService,
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
  TransactionsFormEnum, RoutesEnum
} from "@shared/enums";
import {AuthService} from "@services/auth";
import { ApplicationStatusHttpService } from '@services/core/application-status-http.service';


@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly TransactionsFormEnum = TransactionsFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected documentTypes: DocumentTypeModel[] = [];
  protected applicationStatus: ApplicationStatusModel[] = [];
  protected transactions: TransactionModel[] = [];
  protected fiscalYears: FiscalYearModel[] = [];
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
    private readonly transactionsHttpService: TransactionsHttpService,
    private readonly documentTypesHttpService: DocumentTypesHttpService,
    private readonly applicationStatusHttpService: ApplicationStatusHttpService,
    private readonly fiscalYearsHttpService: FiscalYearsHttpService,
    private readonly unitsHttpService: UnitsHttpService,

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
    this.loadApplicationStatus();
    this.loadTransactions();
    this.loadFiscalYears();
    this.loadUnits();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      code: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      esigef: [null, [Validators.required]],
      value: [null, [Validators.required]],
      isIva: [true, [Validators.required]],
      description: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
      state: [true, [Validators.required]],
      documentType: [null, [Validators.required]],
      applicationStatus: [null, [Validators.required]],
      parent: [null, []],
      process: [null, []],
      fiscalYear: [null, [Validators.required]],
      unit: [null, [Validators.required]],
      principalUnit: [null, []],


    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.codeField.errors) this.formErrors.push(TransactionsFormEnum.code);
    if (this.subjectField.errors) this.formErrors.push(TransactionsFormEnum.subject);
    if (this.esigefField.errors) this.formErrors.push(TransactionsFormEnum.esigef);
    if (this.valueField.errors) this.formErrors.push(TransactionsFormEnum.value);
    if (this.isIvaField.errors) this.formErrors.push(TransactionsFormEnum.isIva);
    if (this.descriptionField.errors) this.formErrors.push(TransactionsFormEnum.description);
    if (this.enabledField.errors) this.formErrors.push(TransactionsFormEnum.enabled);
    if (this.stateField.errors) this.formErrors.push(TransactionsFormEnum.state);
    if (this.documentTypeField.errors) this.formErrors.push(TransactionsFormEnum.documentType);
    if (this.applicationStatusField.errors) this.formErrors.push(TransactionsFormEnum.applicationStatus);
    if (this.parentField.errors) this.formErrors.push(TransactionsFormEnum.parent);
    if (this.processField.errors) this.formErrors.push(TransactionsFormEnum.process);
    if (this.fiscalYearField.errors) this.formErrors.push(TransactionsFormEnum.fiscalYear);
    if (this.unitField.errors) this.formErrors.push(TransactionsFormEnum.unit);
    if (this.principalUnitField.errors) this.formErrors.push(TransactionsFormEnum.principalUnit);


    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.transactionsHttpService.findOne(this.id!).subscribe((transaction) => {
      this.form.patchValue(transaction);
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
    this.router.navigate([this.routesService.transactionsList]);
  }

  create(transaction: CreateTransactionDto): void {
    this.transactionsHttpService.create(transaction).subscribe(transaction => {
      //this.form.reset(transaction);
      this.back();
    });
  }

  update(transaction: UpdateTransactionDto): void {
    this.transactionsHttpService.update(this.id!, transaction).subscribe((transaction) => {
      //this.form.reset(transaction);
      this.back()
    });
  }

  loadDocumentTypes(): void {
    this.documentTypesHttpService.findCatalogues().subscribe((documentTypes) => {
      this.documentTypes = documentTypes;
    });
  }

  loadApplicationStatus(): void {
    this.applicationStatusHttpService.findCatalogues().subscribe((applicationStatus) => {
      this.applicationStatus = applicationStatus;
    });
  }

  loadTransactions(): void {
    this.transactionsHttpService.findCatalogues().subscribe((transactions) => {
      this.transactions = transactions;
    });
  }

  loadFiscalYears(): void {
    this.fiscalYearsHttpService.findCatalogues().subscribe((fiscalYears) => {
      this.fiscalYears = fiscalYears;
    });
  }

  loadUnits(): void {
    this.unitsHttpService.findCatalogues().subscribe((units) => {
      this.units = units;
    });
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get subjectField(): AbstractControl {
    return this.form.controls['subject'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get esigefField(): AbstractControl {
    return this.form.controls['esigef'];
  }

  get valueField(): AbstractControl {
    return this.form.controls['value'];
  }

  get isIvaField(): AbstractControl {
    return this.form.controls['isIva'];
  }

  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }

  get stateField(): AbstractControl {
    return this.form.controls['state'];
  }

  get documentTypeField(): AbstractControl {
    return this.form.controls['documentType'];
  }

  get applicationStatusField(): AbstractControl {
    return this.form.controls['applicationStatus'];
  }

  get parentField(): AbstractControl {
    return this.form.controls['parent'];
  }

  get processField(): AbstractControl {
    return this.form.controls['process'];
  }

  get fiscalYearField(): AbstractControl {
    return this.form.controls['fiscalYear'];
  }

  get unitField(): AbstractControl {
    return this.form.controls['unit'];
  }

  get principalUnitField(): AbstractControl {
    return this.form.controls['principalUnit'];
  }
}

