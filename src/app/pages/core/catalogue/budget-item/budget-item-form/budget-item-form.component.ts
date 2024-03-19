import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreateBudgetItemDto, ExpenseGroupModel, UpdateBudgetItemDto} from '@models/core';
import {
  BreadcrumbService,
  BudgetItemsHttpService,
  CoreService,
  ExpenseGroupsHttpService,
  MessageService,
  RoutesService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
   RoutesEnum,
   BudgetItemsFormEnum
} from "@shared/enums";
import {getSlug} from "@shared/helpers";

@Component({
  selector: 'app-budget-item-form',
  templateUrl: './budget-item-form.component.html',
  styleUrl: './budget-item-form.component.scss'
})
export class BudgetItemFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BudgetItemsFormEnum = BudgetItemsFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';
  private saving: boolean = true;

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected expenseGroups: ExpenseGroupModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly budgetItemsHttpService: BudgetItemsHttpService,
    private readonly expenseGroupsHttpService: ExpenseGroupsHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.BUDGET_ITEMS, routerLink: [this.routesService.budgetItemsList]},
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
    this.loadExpenseGroups();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
      sort: [this.coreService.higherSort, [Validators.required]],
      expenseGroup: [null, [Validators.required]],
    });
  }

  checkValueChanges() {
    this.nameField.valueChanges.subscribe(value => {
      if (this.id == RoutesEnum.NEW) {
        this.codeField.setValue(getSlug(value));
      }
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.codeField.errors) this.formErrors.push(BudgetItemsFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(BudgetItemsFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(BudgetItemsFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(BudgetItemsFormEnum.sort);
    if (this.expenseGroupField.errors) this.formErrors.push(BudgetItemsFormEnum.expenseGroup);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.budgetItemsHttpService.findOne(this.id!).subscribe((budgetItem) => {
      this.form.patchValue(budgetItem);
    });
  }

  onSubmit(): void {
    if (this.validateFormErrors) {
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
    this.router.navigate([this.routesService.budgetItemsList]);
  }

  create(budgetItem: CreateBudgetItemDto): void {
    this.budgetItemsHttpService.create(budgetItem).subscribe(budgetItem => {
      //this.form.reset(budgetItem);
      this.saving = false;
      this.back();
    });
  }

  update(budgetItem: UpdateBudgetItemDto): void {
    this.budgetItemsHttpService.update(this.id!, budgetItem).subscribe((budgetItem) => {
      //this.form.reset(budgetItem);
      this.saving = false;
      this.back()
    });
  }

  loadExpenseGroups(): void {
    this.expenseGroupsHttpService.findCatalogues().subscribe((expenseGroups) => {
      this.expenseGroups = expenseGroups;
    });
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get sortField(): AbstractControl {
    return this.form.controls['sort'];
  }

  get expenseGroupField(): AbstractControl {
    return this.form.controls['expenseGroup'];
  }
}
