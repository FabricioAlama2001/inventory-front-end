import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {
  CreateActivityDto,
  IndicatorComponentModel,
  ComponentModel,
  UpdateActivityDto,
  FiscalYearModel
} from '@models/core';
import {
  BreadcrumbService,
  ActivitiesHttpService,
  CoreService,
  MessageService,
  RoutesService,
  ComponentsHttpService,
  FiscalYearsHttpService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
  ActivitiesFormEnum, RoutesEnum
} from "@shared/enums";


@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.scss'
})
export class ActivityFormComponent implements OnInit, OnExitInterface{
  @Input({alias: 'componentId'}) componentId: string = '';
  @Input({alias: 'activityId'}) id: string = '';

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ActivitiesFormEnum = ActivitiesFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected components: ComponentModel[] = [];
  protected fiscalYears: FiscalYearModel[] = [];


  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly componentsHttpService: ComponentsHttpService,
    private readonly activitiesHttpService: ActivitiesHttpService,
    private readonly fiscalYearsHttpService: FiscalYearsHttpService,

  ) {
    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.COMPONENTS, routerLink: [this.routesService.componentsList]},
      {label: BreadcrumbEnum.ACTIVITIES, routerLink: [this.routesService.activitiesList(this.id)]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.loadComponents();
    this.loadFiscalYears();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      fiscalYear: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
      component: [null, [Validators.required]],
    });
  }

  get validateFormErrors() {
    this.formErrors = [];
    if (this.componentField.errors) this.formErrors.push(ActivitiesFormEnum.component);
    if (this.codeField.errors) this.formErrors.push(ActivitiesFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(ActivitiesFormEnum.name);
    if (this.fiscalYearField.errors) this.formErrors.push(ActivitiesFormEnum.fiscalYear);
    if (this.enabledField.errors) this.formErrors.push(ActivitiesFormEnum.enabled);


    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.activitiesHttpService.findOne(this.id!).subscribe((component) => {
      this.form.patchValue(component);
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
    this.router.navigate([this.routesService.activitiesList(this.id)]);
  }

  create(activity: CreateActivityDto): void {
    this.activitiesHttpService.create(activity).subscribe(activity => {
      //this.form.reset(activity);
      this.back();
    });
  }

  update(activity: UpdateActivityDto): void {
    this.activitiesHttpService.update(this.id!, activity).subscribe((activity) => {
      //this.form.reset(activity);
      this.back()
    });
  }

  loadComponents(): void {
    this.componentsHttpService.findCatalogues().subscribe((components) => {
      this.components = components;
      this.componentField.patchValue(this.components.find(item => item.id === this.componentId));
    });
  }

  loadFiscalYears(): void {
    this.fiscalYearsHttpService.findCatalogues().subscribe((fiscalYears) => {
      this.fiscalYears = fiscalYears;
    });
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
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

  get componentField(): AbstractControl {
    return this.form.controls['component'];
  }
}
