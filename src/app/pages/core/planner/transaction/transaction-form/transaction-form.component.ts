/*import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {
  CreateProjectDto,
  ExpenseTypeModel,
  FiscalYearModel,
  PndObjectiveModel,
  PndPoliceModel,
  UpdateProjectDto
} from '@models/core';
import {PndObjectivesHttpService} from '@services/core/pnd-objectives-http.service';
import {PndPolicesHttpService} from '@services/core/pnd-polices-http.service';
import {ExpenseTypesHttpService} from '@services/core/expense-types-http.service';
import {
  BreadcrumbService,
  CoreService,
  FiscalYearsHttpService,
  MessageService,
  RoutesService,
  TransactionsHttpService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  CatalogueTypeEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SubactivitiesFormEnum,
  SkeletonEnum, UsersFormEnum,
  UsersIdentificationTypeStateEnum,
  CatalogueEnum,
  TransactionsFormEnum, RoutesEnum
} from "@shared/enums";
import {debounceTime} from "rxjs";
import {AuthService} from "@services/auth";


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

  protected pndObjectives: PndObjectiveModel[] = [];
  protected pndPolices: PndPoliceModel[] = [];
  protected expenseTypes: ExpenseTypeModel[] = [];
  protected fiscalYears: FiscalYearModel[] = [];

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
    private readonly pndObjectivesHttpService: PndObjectivesHttpService,
    private readonly pndPolicesHttpService: PndPolicesHttpService,
    private readonly expenseTypesHttpService: ExpenseTypesHttpService,
    private readonly fiscalYearsHttpService: FiscalYearsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.TRANSACTIONS, routerLink: [this.routesService.transactionsList]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.form = this.newForm;

    this.checkValueChanges();
  }

  async onExit(): Promise<boolean> {
    if ((this.form.touched || this.form.dirty) && this.saving) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadExpenseTypes();
    this.loadPndObjectives();
    this.loadExpenseTypes();
    this.loadFiscalYears();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      fiscalYear: [this.authService.fiscalYear, [Validators.required]],
      enabled: [true, [Validators.required]],
      pndObjective: [null, [Validators.required]],
      pndPolice: [null, [Validators.required]],
      expenseType: [null, [Validators.required]],
    });
  }

  checkValueChanges() {
    this.pndObjectiveField.valueChanges.subscribe(value => {
      this.loadPndPolices();
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.nameField.errors) this.formErrors.push(TransactionsFormEnum.name);
    if (this.fiscalYearField.errors) this.formErrors.push(TransactionsFormEnum.fiscalYear);
    if (this.enabledField.errors) this.formErrors.push(TransactionsFormEnum.enabled);
    if (this.pndObjectiveField.errors) this.formErrors.push(TransactionsFormEnum.pndObjective);
    if (this.pndPoliceField.errors) this.formErrors.push(TransactionsFormEnum.pndPolice);
    if (this.expenseTypeField.errors) this.formErrors.push(TransactionsFormEnum.expenseType);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.transactionsHttpService.findOne(this.id!).subscribe((project) => {
      this.form.patchValue(project);
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
    this.router.navigate([this.routesService.projectsList]);
  }

  create(project: CreateProjectDto): void {
    this.transactionsHttpService.create(project).subscribe(project => {
      //this.form.reset(project);
      this.back();
    });
  }

  update(project: UpdateProjectDto): void {
    this.transactionsHttpService.update(this.id!, project).subscribe((project) => {
      //this.form.reset(project);
      this.back()
    });
  }

  loadExpenseTypes(): void {
    this.expenseTypesHttpService.findCatalogues().subscribe((expenseTypes) => {
      this.expenseTypes = expenseTypes;
    });
  }

  loadPndObjectives(): void {
    this.pndObjectivesHttpService.findCatalogues().subscribe((pndObjectives) => {
      this.pndObjectives = pndObjectives;
    });
  }

  loadPndPolices(): void {
    this.pndPolicesHttpService.findCatalogues().subscribe((pndPolices) => {
      this.pndPolices = pndPolices.filter(item => item.pndObjectiveId === this.pndObjectiveField.value.id);
    });
  }

  loadFiscalYears(): void {
    this.fiscalYearsHttpService.findCatalogues().subscribe((fiscalYears) => {
      this.fiscalYears = fiscalYears;
    });
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get fiscalYearField(): AbstractControl {
    return this.form.controls['fiscalYear'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get pndObjectiveField(): AbstractControl {
    return this.form.controls['pndObjective'];
  }

  get pndPoliceField(): AbstractControl {
    return this.form.controls['pndPolice'];
  }

  get expenseTypeField(): AbstractControl {
    return this.form.controls['expenseType'];
  }
}
*/