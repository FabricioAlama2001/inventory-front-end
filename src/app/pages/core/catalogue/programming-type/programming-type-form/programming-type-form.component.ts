import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import { CreateProgrammingTypeDto, UpdateProgrammingTypeDto, } from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  ExpenseTypesHttpService,
  MessageService,
  ProgrammingTypesHttpService,
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
   ProgrammingTypesFormEnum
} from "@shared/enums";
import { getSlug } from '@shared/helpers/slug.helper';

@Component({
  selector: 'app-programming-type-form',
  templateUrl: './programming-type-form.component.html',
  styleUrl: './programming-type-form.component.scss'
})
export class ProgrammingTypeFormComponent {
protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ProgrammingTypesFormEnum = ProgrammingTypesFormEnum;
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
    private readonly programmingTypesHttpService: ProgrammingTypesHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.PROGRAMMING_TYPES, routerLink: [this.routesService.programmingTypesList]},
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
      if (this.id == RoutesEnum.NEW) {
        this.codeField.setValue(getSlug(value));
      }
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.codeField.errors) this.formErrors.push(ProgrammingTypesFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(ProgrammingTypesFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(ProgrammingTypesFormEnum.enabled);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.programmingTypesHttpService.findOne(this.id!).subscribe((programmingType) => {
      this.form.patchValue(programmingType);
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
    this.router.navigate([this.routesService.programmingTypesList]);
  }

  create(programmingType: CreateProgrammingTypeDto): void {
    this.programmingTypesHttpService.create(programmingType).subscribe(programmingType => {
      //this.form.reset(programmingType);
      this.saving = false;
      this.back();
    });
  }

  update(programmingType: UpdateProgrammingTypeDto): void {
    this.programmingTypesHttpService.update(this.id!, programmingType).subscribe((programmingType) => {
      //this.form.reset(programmingType);
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
}
