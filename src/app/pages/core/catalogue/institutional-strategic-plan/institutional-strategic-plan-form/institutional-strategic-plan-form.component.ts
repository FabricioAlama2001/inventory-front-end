import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreateInstitutionalStrategicPlanDto,  PndPoliceModel,  UpdateInstitutionalStrategicPlanDto} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  InstitutionalStrategicPlansHttpService,
  MessageService,
  PndPolicesHttpService,
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
   InstitutionalStrategicPlansFormEnum
} from "@shared/enums";

@Component({
  selector: 'app-institutional-strategic-plan-form',
  templateUrl: './institutional-strategic-plan-form.component.html',
  styleUrl: './institutional-strategic-plan-form.component.scss'
})
export class InstitutionalStrategicPlanFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly InstitutionalStrategicPlansFormEnum = InstitutionalStrategicPlansFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';
  private saving: boolean = true;

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected pndPolices: PndPoliceModel[] = [];


  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly institutionalStrategicPlansHttpService: InstitutionalStrategicPlansHttpService,
    private readonly pndPolicesHttpService: PndPolicesHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONAL_STRATEGIC_PLANS, routerLink: [this.routesService.institutionalStrategicPlansList]},
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
      pndPolice: [null, [Validators.required]],
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
    if (this.pndPoliceField.errors) this.formErrors.push(InstitutionalStrategicPlansFormEnum.pndPolice);
    if (this.codeField.errors) this.formErrors.push(InstitutionalStrategicPlansFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(InstitutionalStrategicPlansFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(InstitutionalStrategicPlansFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(InstitutionalStrategicPlansFormEnum.sort);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.institutionalStrategicPlansHttpService.findOne(this.id!).subscribe((plan) => {
      this.form.patchValue(plan);
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

  loadPndPolices(): void {
    this.pndPolicesHttpService.findCatalogues().subscribe((pndPolices) => {
      this.pndPolices = pndPolices;
    });
  }

  back(): void {
    this.router.navigate([this.routesService.institutionalStrategicPlansList]);
  }

  create(plan: CreateInstitutionalStrategicPlanDto): void {
    this.institutionalStrategicPlansHttpService.create(plan).subscribe(plan => {
      //this.form.reset(plan);
      this.saving = false;
      this.back();
    });
  }

  update(plan: UpdateInstitutionalStrategicPlanDto): void {
    this.institutionalStrategicPlansHttpService.update(this.id!, plan).subscribe((plan) => {
      //this.form.reset(plan);
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

  get pndPoliceField(): AbstractControl {
    return this.form.controls['pndPolice'];
  }
}
