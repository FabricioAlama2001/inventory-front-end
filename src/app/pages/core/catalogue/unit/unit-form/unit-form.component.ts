import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import { CreateUnitDto, UnitModel, UpdateUnitDto, } from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  RoutesService,
  UnitsHttpService,
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
   RoutesEnum,
   UnitsFormEnum
} from "@shared/enums";

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.scss'
})
export class UnitFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly UnitsFormEnum = UnitsFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';
  private saving: boolean = true;

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected units: UnitModel[] = [];


  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly unitsHttpService: UnitsHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.UNITS, routerLink: [this.routesService.unitsList]},
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

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
    this.loadUnits();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      parent: [null, []],
      principal: [null, []],
      acronym: [null, [Validators.required]],
      name: [null, [Validators.required]],
      executor: [true, [Validators.required]],
      level: [null, [Validators.required]],
      sort: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
    });
  }

  get validateFormErrors() {
    this.formErrors = [];
    if (this.parentField.errors) this.formErrors.push(UnitsFormEnum.parent);
    if (this.principalField.errors) this.formErrors.push(UnitsFormEnum.principal);
    if (this.acronymField.errors) this.formErrors.push(UnitsFormEnum.acronym);
    if (this.nameField.errors) this.formErrors.push(UnitsFormEnum.name);
    if (this.executorField.errors) this.formErrors.push(UnitsFormEnum.executor);
    if (this.levelField.errors) this.formErrors.push(UnitsFormEnum.level);
    if (this.sortField.errors) this.formErrors.push(UnitsFormEnum.sort);
    if (this.enabledField.errors) this.formErrors.push(UnitsFormEnum.enabled);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.unitsHttpService.findOne(this.id!).subscribe((unit) => {
      this.form.patchValue(unit);
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

  loadUnits(): void {
    this.unitsHttpService.findCatalogues().subscribe((units) => {
      this.units = units;
    });
  }

  back(): void {
    this.router.navigate([this.routesService.unitsList]);
  }

  create(unit: CreateUnitDto): void {
    this.unitsHttpService.create(unit).subscribe(unit => {
      //this.form.reset(unit);
      this.saving = false;
      this.back();
    });
  }

  update(unit: UpdateUnitDto): void {
    this.unitsHttpService.update(this.id!, unit).subscribe((unit) => {
      //this.form.reset(unit);
      this.saving = false;
      this.back()
    });
  }

  get acronymField(): AbstractControl {
    return this.form.controls['acronym'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get executorField(): AbstractControl {
    return this.form.controls['executor'];
  }

  get levelField(): AbstractControl {
    return this.form.controls['level'];
  }

  get sortField(): AbstractControl {
    return this.form.controls['sort'];
  }

  get parentField(): AbstractControl {
    return this.form.controls['parent'];
  }

  get principalField(): AbstractControl {
    return this.form.controls['principal'];
  }
}
