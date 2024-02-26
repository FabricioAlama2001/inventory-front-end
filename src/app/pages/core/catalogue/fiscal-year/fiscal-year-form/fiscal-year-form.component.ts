import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import { CreateFiscalYearDto, UpdateFiscalYearDto, } from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  FiscalYearsHttpService,
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
   FiscalYearsFormEnum
} from "@shared/enums";


@Component({
  selector: 'app-fiscal-year-form',
  templateUrl: './fiscal-year-form.component.html',
  styleUrl: './fiscal-year-form.component.scss'
})
export class FiscalYearFormComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly FiscalYearsFormEnum = FiscalYearsFormEnum;
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
    private readonly fiscalYearsHttpService: FiscalYearsHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.FISCAL_YEARS, routerLink: [this.routesService.fiscalYearsList]},
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
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
      sort: [this.coreService.higherSort, [Validators.required]],
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

    if (this.codeField.errors) this.formErrors.push(FiscalYearsFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(FiscalYearsFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(FiscalYearsFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(FiscalYearsFormEnum.sort);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.fiscalYearsHttpService.findOne(this.id!).subscribe((fiscalYear) => {
      this.form.patchValue(fiscalYear);
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
    this.router.navigate([this.routesService.fiscalYearsList]);
  }

  create(fiscalYear: CreateFiscalYearDto): void {
    this.fiscalYearsHttpService.create(fiscalYear).subscribe(fiscalYear => {
      //this.form.reset(fiscalYear);
      this.saving = false;
      this.back();
    });
  }

  update(fiscalYear: UpdateFiscalYearDto): void {
    this.fiscalYearsHttpService.update(this.id!, fiscalYear).subscribe((fiscalYear) => {
      //this.form.reset(fiscalYear);
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
