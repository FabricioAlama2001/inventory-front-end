import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import { CreateExpenseTypeDto, UpdateExpenseTypeDto, } from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  ExpenseTypesHttpService,
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
   ExpenseTypesFormEnum
} from "@shared/enums";

@Component({
  selector: 'app-expense-type-form',
  templateUrl: './expense-type-form.component.html',
  styleUrl: './expense-type-form.component.scss'
})
export class ExpenseTypeFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ExpenseTypesFormEnum = ExpenseTypesFormEnum;
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
    private readonly expenseTypesHttpService: ExpenseTypesHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.EXPENSE_TYPES, routerLink: [this.routesService.expenseTypesList]},
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
      enabled: [true, []],
      sort: [this.coreService.higherSort, []],
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

    if (this.codeField.errors) this.formErrors.push(ExpenseTypesFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(ExpenseTypesFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(ExpenseTypesFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(ExpenseTypesFormEnum.sort);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.expenseTypesHttpService.findOne(this.id!).subscribe((expenseType) => {
      this.form.patchValue(expenseType);
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
    this.router.navigate([this.routesService.expenseTypesList]);
  }

  create(expenseType: CreateExpenseTypeDto): void {
    this.expenseTypesHttpService.create(expenseType).subscribe(expenseType => {
      //this.form.reset(expenseType);
      this.saving = false;
      this.back();
    });
  }

  update(expenseType: UpdateExpenseTypeDto): void {
    this.expenseTypesHttpService.update(this.id!, expenseType).subscribe((expenseType) => {
      //this.form.reset(expenseType);
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
