import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreateBudgetItemDto, CreateExpenseGroupDto, UpdateBudgetItemDto, UpdateExpenseGroupDto} from '@models/core';
import {CatalogueModel} from "@models/core";
import {
  BreadcrumbService,
  BudgetItemsHttpService,
  CataloguesHttpService,
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
  CatalogueEnum,
   RoutesEnum, 
   ExpenseGroupsFormEnum
} from "@shared/enums";
import {debounceTime} from "rxjs";
@Component({
  selector: 'app-expense-group-form',
  templateUrl: './expense-group-form.component.html',
  styleUrl: './expense-group-form.component.scss'
})
export class ExpenseGroupFormComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ExpenseGroupsFormEnum = ExpenseGroupsFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';
  private saving: boolean = true;

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly expenseGroupsHttpService: ExpenseGroupsHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.EXPENSE_GROUP, routerLink: [this.routesService.expenseGroups]},
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

    if (this.codeField.errors) this.formErrors.push(ExpenseGroupsFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(ExpenseGroupsFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(ExpenseGroupsFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(ExpenseGroupsFormEnum.sort);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }


  get(): void {
    this.expenseGroupsHttpService.findOne(this.id!).subscribe((expenseGroup) => {
      this.form.patchValue(expenseGroup);
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
    this.router.navigate([this.routesService.expenseGroups]);
  }

  create(expenseGroup: CreateExpenseGroupDto): void {
    this.expenseGroupsHttpService.create(expenseGroup).subscribe(expenseGroup => {
      //this.form.reset(expenseGroup);
      this.saving = false;
      this.back();
    });
  }

  update(expenseGroup: UpdateExpenseGroupDto): void {
    this.expenseGroupsHttpService.update(this.id!, expenseGroup).subscribe((expenseGroup) => {
      //this.form.reset(expenseGroup);
      this.saving = false;
      this.back()
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
}
