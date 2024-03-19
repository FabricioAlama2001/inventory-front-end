import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import { CreateStrategyDto, StrategicAxisModel, UpdateStrategyDto, } from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  RoutesService,
  StrategicAxesHttpService,
  StrategiesHttpService,
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
   RoutesEnum,
   StrategiesFormEnum
} from "@shared/enums";
import { getSlug } from '@shared/helpers/slug.helper';


@Component({
  selector: 'app-strategy-form',
  templateUrl: './strategy-form.component.html',
  styleUrl: './strategy-form.component.scss'
})
export class StrategyFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly StrategiesFormEnum = StrategiesFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';
  private saving: boolean = true;

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];
  protected strategicAxes: StrategicAxisModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly strategiesHttpService: StrategiesHttpService,
    private readonly strategicAxisHttpService: StrategicAxesHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.STRATEGIES, routerLink: [this.routesService.strategiesList]},
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

    this.loadStrategicAxis();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      strategicAxis: [null, [Validators.required]],
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
    if (this.strategicAxisField.errors) this.formErrors.push(StrategiesFormEnum.strategicAxis);
    if (this.codeField.errors) this.formErrors.push(StrategiesFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(StrategiesFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(StrategiesFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(StrategiesFormEnum.sort);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.strategiesHttpService.findOne(this.id!).subscribe((strategy) => {
      this.form.patchValue(strategy);
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
    this.router.navigate([this.routesService.strategicAxesList]);
  }

  create(strategy: CreateStrategyDto): void {
    this.strategiesHttpService.create(strategy).subscribe(strategy => {
      //this.form.reset(strategy);
      this.saving = false;
      this.back();
    });
  }

  update(strategy: UpdateStrategyDto): void {
    this.strategiesHttpService.update(this.id!, strategy).subscribe((strategy) => {
      //this.form.reset(strategy);
      this.saving = false;
      this.back()
    });
  }

  loadStrategicAxis(): void {
    this.strategicAxisHttpService.findCatalogues().subscribe((strategicAxes) => {
      this.strategicAxes = strategicAxes;
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

  get strategicAxisField(): AbstractControl {
    return this.form.controls['strategicAxis'];
  }
}
