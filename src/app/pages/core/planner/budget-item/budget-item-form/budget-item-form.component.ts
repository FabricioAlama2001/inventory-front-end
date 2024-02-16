import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreateBudgetItemDto, UpdateBudgetItemDto} from '@models/core';
import {CatalogueModel} from "@models/core";
import {PndObjectivesHttpService} from '@services/core/pnd-objectives-http.services';
import {PndPolicesHttpService} from '@services/core/pnd-polices-http.service';
import {
  BreadcrumbService,
  BudgetItemsHttpService,
  CataloguesHttpService,
  CoreService,
  ExpenseGroupsHttpService,
  MessageService,
  ProjectsHttpService,
  RoutesService
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
  ProjectsFormEnum, RoutesEnum, BudgetItemsFormEnum
} from "@shared/enums";
import {debounceTime} from "rxjs";


@Component({
  selector: 'app-budget-item-form',
  templateUrl: './budget-item-form.component.html',
  styleUrl: './budget-item-form.component.scss'
})
export class BudgetItemFormComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BudgetItemsFormEnum = BudgetItemsFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected expenseGroups: CatalogueModel[] = [];

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
      {label: BreadcrumbEnum.SUBACTIVITIES, routerLink: [this.routesService.subactivities]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.form = this.newForm;

    this.checkValueChanges();
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
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
      code: [null, []],
      name: [null, []],
      enabled: [null, []],
      sort: [null, []],
      expenseGroup: [null, []],
    });
  }

  checkValueChanges() {
    this.nameField.valueChanges.subscribe(value => {
      const str = value.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      this.codeField.setValue(str);
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
    this.router.navigate([this.routesService.budgetItems]);
  }

  create(budgetItem: CreateBudgetItemDto): void {
    this.budgetItemsHttpService.create(budgetItem).subscribe(budgetItem => {
      //this.form.reset(budgetItem);
      this.back();
    });
  }

  update(budgetItem: UpdateBudgetItemDto): void {
    this.budgetItemsHttpService.update(this.id!, budgetItem).subscribe((budgetItem) => {
      //this.form.reset(budgetItem);
      this.back()
    });
  }

  loadExpenseGroups(): void {
    this.expenseGroups = this.expenseGroupsHttpService.findCatalogue(CatalogueEnum.EXPENSE_GROUP);
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
