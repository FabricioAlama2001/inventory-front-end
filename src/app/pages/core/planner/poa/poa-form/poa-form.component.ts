import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {
  ActivityModel,
  BudgetItemModel,
  CreatePoaDto,
  ExpenseTypeModel,
  FundingSourceModel,
  UpdatePoaDto
} from '@models/core';
import {ExpenseTypesHttpService} from '@services/core/expense-types-http.service';
import {
  ActivitiesHttpService,
  BreadcrumbService,
  BudgetItemsHttpService,
  CoreService,
  FiscalYearsHttpService,
  FundingSourcesHttpService,
  MessageService,
  PoasHttpService,
  RoutesService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
  PoasFormEnum, RoutesEnum
} from "@shared/enums";
import {AuthService} from "@services/auth";

@Component({
  selector: 'app-poa-form',
  templateUrl: './poa-form.component.html',
  styleUrl: './poa-form.component.scss'
})
export class PoaFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PoasFormEnum = PoasFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected activities: ActivityModel[] = [];
  protected budgetItems: BudgetItemModel[] = [];
  protected fundingSources: FundingSourceModel[] = [];
  protected expenseTypes: ExpenseTypeModel[] = [];

  private saving: boolean = true;

  constructor(
    private readonly authService: AuthService,
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly poasHttpService: PoasHttpService,
    private readonly expenseTypesHttpService: ExpenseTypesHttpService,
    private readonly activgitiesHttpService: ActivitiesHttpService,
    private readonly budgetItemsHttpService: BudgetItemsHttpService,
    private readonly fundingSourcesHttpService: FundingSourcesHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.POAS, routerLink: [this.routesService.poasList]},
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
    this.loadExpenseTypes();
    this.loadBudgetItems();
    this.loadFundingSources();
    this.loadActivities();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      activity: [null, [Validators.required]],
      budgetItem: [null, [Validators.required]],
      fundingSource: [null, [Validators.required]],
      expenseType: [null, [Validators.required]],
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.activityField.errors) this.formErrors.push(PoasFormEnum.activity);
    if (this.budgetItemField.errors) this.formErrors.push(PoasFormEnum.budgetItem);
    if (this.fundingSourceField.errors) this.formErrors.push(PoasFormEnum.fundingSource);
    if (this.expenseTypeField.errors) this.formErrors.push(PoasFormEnum.expenseType);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.poasHttpService.findOne(this.id!).subscribe((poa) => {
      this.form.patchValue(poa);
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
    this.router.navigate([this.routesService.poasList]);
  }

  create(poa: CreatePoaDto): void {
    this.poasHttpService.create(poa).subscribe(poa => {
      //this.form.reset(poa);
      this.back();
    });
  }

  update(poa: UpdatePoaDto): void {
    this.poasHttpService.update(this.id!, poa).subscribe((poa) => {
      //this.form.reset(poa);
      this.back()
    });
  }

  loadExpenseTypes(): void {
    this.expenseTypesHttpService.findCatalogues().subscribe((expenseTypes) => {
      this.expenseTypes = expenseTypes;
    });
  }

  loadActivities(): void {
    this.activgitiesHttpService.findCatalogues().subscribe((activities) => {
      this.activities = activities;
    });
  }

  loadBudgetItems(): void {
    this.budgetItemsHttpService.findCatalogues().subscribe((budgetItems) => {
      this.budgetItems = budgetItems
    });
  }

  loadFundingSources(): void {
    this.fundingSourcesHttpService.findCatalogues().subscribe((fundingSources) => {
      this.fundingSources = fundingSources;
    });
  }

  get activityField(): AbstractControl {
    return this.form.controls['activity'];
  }

  get budgetItemField(): AbstractControl {
    return this.form.controls['budgetItem'];
  }

  get fundingSourceField(): AbstractControl {
    return this.form.controls['fundingSource'];
  }

  get expenseTypeField(): AbstractControl {
    return this.form.controls['expenseType'];
  }

}
