import {Component, inject, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {
  ActivityModel,
  CatalogueModel, ComponentModel,
  ContinentModel,
  CreateSubactivityDto,
  FiscalYearModel,
  IndicatorSubactivityModel,
  InstitutionalStrategicPlanModel,
  LocationModel,
  PoaModel, ProjectModel,
  StrategicAxisModel,
  StrategyModel,
  UnitModel,
  UpdateSubactivityDto
} from '@models/core';
import {ExpenseTypesHttpService} from '@services/core/expense-types-http.service';
import {
  ActivitiesHttpService,
  BreadcrumbService,
  CataloguesHttpService, ComponentsHttpService,
  ContinentsHttpService,
  CoreService,
  FiscalYearsHttpService,
  IndicatorSubactivitiesHttpService,
  InstitutionalStrategicPlansHttpService,
  LocationsHttpService,
  MessageService,
  PoasHttpService, ProjectsHttpService,
  RoutesService,
  StrategicAxesHttpService,
  StrategiesHttpService,
  SubactivitiesHttpService,
  UnitsHttpService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  CatalogueTypeEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum, ProjectsFormEnum,
  RoutesEnum,
  SkeletonEnum,
  SubactivitiesFormEnum, SubactivityTypeEnum
} from "@shared/enums";
import {AuthService} from "@services/auth";

@Component({
  selector: 'app-subactivity-form',
  templateUrl: './subactivity-form.component.html',
  styleUrl: './subactivity-form.component.scss'
})
export class SubactivityFormComponent implements OnInit, OnExitInterface {
  private readonly projectHttpService = inject(ProjectsHttpService);
  private readonly componentsHttpService = inject(ComponentsHttpService);
  private readonly activitiesHttpService = inject(ActivitiesHttpService);
  private readonly authService = inject(AuthService);
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly SubactivitiesFormEnum = SubactivitiesFormEnum;
  protected readonly SubactivityTypeEnum = SubactivityTypeEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected fiscalYears: FiscalYearModel[] = [];
  protected indicatorSubactivities: IndicatorSubactivityModel[] = [];
  protected institutionalStrategicPlans: InstitutionalStrategicPlanModel[] = [];
  protected strategicAxes: StrategicAxisModel[] = [];
  protected strategies: StrategyModel[] = [];
  protected continents: CatalogueModel[] = [];
  protected poas: PoaModel[] = [];
  protected units: UnitModel[] = [];

  protected countries: LocationModel[] = [];
  protected provinces: LocationModel[] = [];
  protected cantons: LocationModel[] = [];
  protected parishes: LocationModel[] = [];
  protected projects: ProjectModel[] = [];
  protected components: ComponentModel[] = [];
  protected activities: ActivityModel[] = [];
  protected types: string[] = [SubactivityTypeEnum.nuevo,SubactivityTypeEnum.arrastre];

  private saving: boolean = true;

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly cataloguesHttpService: CataloguesHttpService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly subactivitiesHttpService: SubactivitiesHttpService,
    private readonly expenseTypesHttpService: ExpenseTypesHttpService,
    private readonly locationsHttpService: LocationsHttpService,
    private readonly fiscalYearsHttpService: FiscalYearsHttpService,
    private readonly indicatorSubactivitiesHttpService: IndicatorSubactivitiesHttpService,
    private readonly institutionalStrategicPlansHttpService: InstitutionalStrategicPlansHttpService,
    private readonly strategicAxesHttpService: StrategicAxesHttpService,
    private readonly strategiesHttpService: StrategiesHttpService,
    private readonly continentsHttpService: ContinentsHttpService,
    private readonly poasHttpService: PoasHttpService,
    private readonly unitsHttpService: UnitsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.SUBACTIVITIES, routerLink: [this.routesService.subactivitiesList]},
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
    this.loadFiscalYears();
    this.loadCountries();
    this.loadFiscalYears();
    this.loadIndicatorSubactivities();
    this.loadInstitutionalStrategicPlans();
    this.loadContinents();
    this.loadPoas();
    this.loadUnits();
    this.loadProjects();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      activity: [null, [Validators.required]],
      component: [null, [Validators.required]],
      fiscalYear: [this.authService.fiscalYear, [Validators.required]],
      indicatorSubactivity: [null, [Validators.required]],
      institutionalStrategicPlan: [null, [Validators.required]],
      strategicAxis: [null, [Validators.required]],
      strategy: [null, [Validators.required]],
      continent: [null, [Validators.required]],
      country: [null, [Validators.required]],
      province: [null, [Validators.required]],
      canton: [null, [Validators.required]],
      project: [null, [Validators.required]],
      parish: [null, [Validators.required]],
      poa: [null, [Validators.required]],
      unit: [null, [Validators.required]],
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
    });
  }

  checkValueChanges() {
    this.projectField.valueChanges.subscribe(value => {
      this.loadComponents();
      this.activities = [];
    });

    this.componentField.valueChanges.subscribe(value => {
      this.loadActivities();
    });

    this.institutionalStrategicPlanField.valueChanges.subscribe(value => {
      this.loadStrategicAxis();
      this.strategies = [];
    });

    this.strategicAxisField.valueChanges.subscribe(value => {
      this.loadStrategies();
    });
  }

  get validateFormErrors() {
    this.formErrors = [];
    if (this.fiscalYearField.errors) this.formErrors.push(SubactivitiesFormEnum.fiscalYear);
    if (this.indicatorSubactivityField.errors) this.formErrors.push(SubactivitiesFormEnum.indicatorSubactivity);
    if (this.institutionalStrategicPlanField.errors) this.formErrors.push(SubactivitiesFormEnum.institutionalStrategicPlan);
    if (this.strategicAxisField.errors) this.formErrors.push(SubactivitiesFormEnum.strategicAxis);
    if (this.strategyField.errors) this.formErrors.push(SubactivitiesFormEnum.strategy);
    if (this.continentField.errors) this.formErrors.push(SubactivitiesFormEnum.continent);
    if (this.countryField.errors) this.formErrors.push(SubactivitiesFormEnum.country);
    if (this.provinceField.errors) this.formErrors.push(SubactivitiesFormEnum.province);
    if (this.cantonField.errors) this.formErrors.push(SubactivitiesFormEnum.canton);
    if (this.parishField.errors) this.formErrors.push(SubactivitiesFormEnum.parish);
    if (this.poaField.errors) this.formErrors.push(SubactivitiesFormEnum.poa);
    if (this.unitField.errors) this.formErrors.push(SubactivitiesFormEnum.unit);

    if (this.nameField.errors) this.formErrors.push(SubactivitiesFormEnum.name);
    if (this.typeField.errors) this.formErrors.push(SubactivitiesFormEnum.type);
    if (this.enabledField.errors) this.formErrors.push(SubactivitiesFormEnum.enabled);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.subactivitiesHttpService.findOne(this.id!).subscribe((subactivity) => {
      this.form.patchValue(subactivity);
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
    this.router.navigate([this.routesService.subactivitiesList]);
  }

  create(subactivity: CreateSubactivityDto): void {
    this.subactivitiesHttpService.create(subactivity).subscribe(subactivity => {
      //this.form.reset(subactivity);
      this.back();
    });
  }

  update(subactivity: UpdateSubactivityDto): void {
    this.subactivitiesHttpService.update(this.id!, subactivity).subscribe((subactivity) => {
      //this.form.reset(subactivity);
      this.back()
    });
  }

  applyValidations() {
    this.countryField.valueChanges.subscribe(value => {
      if (value.alpha3Code === 'ECU') {
        this.loadProvinces(value?.id);
        this.provinceField.addValidators(Validators.required);
        this.cantonField.addValidators(Validators.required);
        this.parishField.addValidators(Validators.required);
      } else {
        this.provinceField.setValue(null);

        this.provinceField.clearValidators();
        this.cantonField.clearValidators();
        this.parishField.clearValidators();

        this.provinces = [];
        this.cantons = [];
        this.parishes = [];
      }

      this.provinceField.updateValueAndValidity();
      this.cantonField.updateValueAndValidity();
      this.parishField.updateValueAndValidity();
    });

    this.provinceField.valueChanges.subscribe(value => {
      this.loadCantons(value?.id);
    });

    this.cantonField.valueChanges.subscribe(value => {
      this.loadParishes(value?.id);
    });
  }

  /**Load Foreign Keys**/
  loadFiscalYears(): void {
    this.fiscalYears = [this.authService.fiscalYear];
  }

  loadIndicatorSubactivities(): void {
    this.indicatorSubactivitiesHttpService.findCatalogues().subscribe((indicatorSubactivities) => {
      this.indicatorSubactivities = indicatorSubactivities;
    });
  }

  loadInstitutionalStrategicPlans(): void {
    this.institutionalStrategicPlansHttpService.findCatalogues().subscribe((institutionalStrategicPlans) => {
      this.institutionalStrategicPlans = institutionalStrategicPlans;
    });
  }

  loadStrategicAxis(): void {
    this.strategicAxesHttpService.findCatalogues().subscribe((strategicAxes) => {
      this.strategicAxes = strategicAxes.filter(item => item.institutionalStrategicPlanId === this.institutionalStrategicPlanField.value.id);
    });
  }

  loadStrategies(): void {
    this.strategiesHttpService.findCatalogues().subscribe((strategies) => {
      this.strategies = strategies.filter(item => item.strategicAxisId === this.strategicAxisField.value.id);
    });
  }

  loadContinents(): void {
    this.continents = this.cataloguesHttpService.findByType(CatalogueTypeEnum.CONTINENT);
  }

  loadPoas(): void {
    this.poasHttpService.findCatalogues().subscribe((poas) => {
      this.poas = poas;
    });
  }

  loadUnits(): void {
    this.unitsHttpService.findCatalogues().subscribe((units) => {
      this.units = units;
    });
  }

  loadCountries(): void {
    this.countries = this.locationsHttpService.findCountries();
  }

  loadProvinces(countryId: string): void {
    this.provinces = this.locationsHttpService.findProvincesByCountry(countryId);
  }

  loadCantons(provinceId: string): void {
    this.cantons = this.locationsHttpService.findCantonsByProvince(provinceId);
  }

  loadParishes(cantonId: string): void {
    this.parishes = this.locationsHttpService.findParishesByCanton(cantonId);
  }

  loadProjects(): void {
    this.projectHttpService.findCatalogues().subscribe((projects) => {
      this.projects = projects;
    });
  }

  loadComponents(): void {
    this.componentsHttpService.findCatalogues().subscribe((components) => {
      this.components = components.filter(item => item.projectId === this.projectField.value.id);
    });
  }

  loadActivities(): void {
    this.activitiesHttpService.findCatalogues().subscribe((activities) => {
      this.activities = activities.filter(item => item.componentId === this.componentField.value.id);
      ;
    });
  }

  /** Getters **/
  get projectField(): AbstractControl {
    return this.form.controls['project'];
  }

  get componentField(): AbstractControl {
    return this.form.controls['component'];
  }

  get activityField(): AbstractControl {
    return this.form.controls['activity'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get typeField(): AbstractControl {
    return this.form.controls['type'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get fiscalYearField(): AbstractControl {
    return this.form.controls['fiscalYear'];
  }

  get indicatorSubactivityField(): AbstractControl {
    return this.form.controls['indicatorSubactivity'];
  }

  get institutionalStrategicPlanField(): AbstractControl {
    return this.form.controls['institutionalStrategicPlan'];
  }

  get strategicAxisField(): AbstractControl {
    return this.form.controls['strategicAxis'];
  }

  get strategyField(): AbstractControl {
    return this.form.controls['strategy'];
  }

  get continentField(): AbstractControl {
    return this.form.controls['continent'];
  }

  get countryField(): AbstractControl {
    return this.form.controls['country'];
  }

  get provinceField(): AbstractControl {
    return this.form.controls['province'];
  }

  get cantonField(): AbstractControl {
    return this.form.controls['canton'];
  }

  get parishField(): AbstractControl {
    return this.form.controls['parish'];
  }

  get poaField(): AbstractControl {
    return this.form.controls['poa'];
  }

  get unitField(): AbstractControl {
    return this.form.controls['unit'];
  }

  protected readonly ProjectsFormEnum = ProjectsFormEnum;
}
