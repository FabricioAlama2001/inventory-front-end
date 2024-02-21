import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreateSubactivityDto, UpdateSubactivityDto} from '@models/core';
import {CatalogueModel} from "@models/core";
import {IndicatorSubactivitiesHttpService, SubactivitiesHttpService, InstitutionalStrategicPlansHttpService, StrategicAxesHttpService, StrategiesHttpService, ContinentsHttpService, CountriesHttpService, ProvincesHttpService, CantonsHttpService, ParishesHttpService, PoasHttpService, UnitsHttpService} from '@services/core';
import {BreadcrumbService, CataloguesHttpService, CoreService, MessageService, RoutesService} from '@services/core';
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
  CatalogueEnum
} from "@shared/enums";

@Component({
  selector: 'app-subactivity-form',
  templateUrl: './subactivity-form.component.html',
  styleUrl: './subactivity-form.component.scss'
})
export class SubactivityFormComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly SubactivitiesFormEnum = SubactivitiesFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected indicatorSubactivities: CatalogueModel[] = [];
  protected institutionalStrategicPlans: CatalogueModel[] = [];
  protected strategicAxes: CatalogueModel[] = [];
  protected strategies: CatalogueModel[] = [];
  protected continents: CatalogueModel[] = [];
  protected countries: CatalogueModel[] = [];
  protected provinces: CatalogueModel[] = [];
  protected cantons: CatalogueModel[] = [];
  protected parishes: CatalogueModel[] = [];
  protected poas: CatalogueModel[] = [];
  protected units: CatalogueModel[] = [];



  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,

    private readonly subactivitiesHttpService: SubactivitiesHttpService,

    private readonly indicatorSubactivitiesHttpService: IndicatorSubactivitiesHttpService,
    private readonly institutionalStrategicPlansHttpService: InstitutionalStrategicPlansHttpService,
    private readonly strategicAxesHttpService: StrategicAxesHttpService,
    private readonly strategiesHttpService: StrategiesHttpService,
    private readonly continentsHttpService: ContinentsHttpService,
    private readonly countriesHttpService: CountriesHttpService,
    private readonly provincesHttpService: ProvincesHttpService,
    private readonly cantonsHttpService: CantonsHttpService,
    private readonly parishesHttpService: ParishesHttpService,
    private readonly poasHttpService: PoasHttpService,
    private readonly unitsHttpService: UnitsHttpService,


  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.SUBACTIVITIES, routerLink: [this.routesService.subactivities]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    if (this.id != 'new') {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, []],
      type: [null, []],
      fiscalYear: [null, []],
      indicatorSubactivity: [null, []],
      institutionalStrategicPlan: [null, []],
      strategicAxis: [null, []],
      strategy: [null, []],
      continent: [null, []],
      country: [null, []],
      province: [null, []],
      canton: [null, []],
      parrish: [null, []],
      poa: [null, []],
      unit: [null, []],
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.nameField.errors) this.formErrors.push(SubactivitiesFormEnum.name);
    if (this.typeField.errors) this.formErrors.push(SubactivitiesFormEnum.type);
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
      if (this.id) {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  back(): void {
    this.router.navigate([this.routesService.subactivities]);
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

  /*loadIndicatorSubactivities(): void {
    this.indicatorSubactivities = this.indicatorSubactivitiesHttpService.findCatalogue(CatalogueEnum.INDICATOR_SUBACTIVITY);
  }

  loadInstitutionalStrategicPlans(): void {
    this.institutionalStrategicPlans = this.institutionalStrategicPlansHttpService.findCatalogue(CatalogueEnum.INSTITUTIONAL_STRATEGIC_PLAN);
  }

  loadStrategicAxis(): void {
    this.strategicAxes = this.strategicAxisHttpService.findCatalogue(CatalogueEnum.STRATEGIC_AXIS);
  }

  loadStrategies(): void {
    this.strategies = this.strategiesHttpService.findCatalogue(CatalogueEnum.STRATEGY);
  }

  loadContinents(): void {
    this.continents = this.continentsHttpService.findCatalogue(CatalogueEnum.CONTINENT);
  }*/

  loadCountries(): void {
    this.countries = this.countriesHttpService.findCatalogue(CatalogueEnum.COUNTRY);
  }

  loadProvinces(): void {
    this.provinces = this.provincesHttpService.findCatalogue(CatalogueEnum.PROVINCE);
  }

  loadCantons(): void {
    this.cantons = this.cantonsHttpService.findCatalogue(CatalogueEnum.CANTON);
  }

  loadParishes(): void {
    this.parishes = this.parishesHttpService.findCatalogue(CatalogueEnum.PARISH);
  }

  loadPoas(): void {
    this.poas = this.poasHttpService.findCatalogue(CatalogueEnum.POA);
  }

  loadUnits(): void {
    this.units = this.unitsHttpService.findCatalogue(CatalogueEnum.UNIT);
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get typeField(): AbstractControl {
    return this.form.controls['type'];
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
}
