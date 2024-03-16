import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {
  CreateProjectDto,
  CreateUnitManagerDto,
  UnitModel,
  UpdateProjectDto,
  UpdateUnitManagerDto
} from '@models/core';
import {PndObjectivesHttpService} from '@services/core/pnd-objectives-http.service';
import {PndPolicesHttpService} from '@services/core/pnd-polices-http.service';
import {ExpenseTypesHttpService} from '@services/core/expense-types-http.service';
import {
  BreadcrumbService,
  CoreService,
  FiscalYearsHttpService,
  MessageService,
  ProjectsHttpService,
  RoutesService,
  UnitManagersHttpService,
  UnitsHttpService
} from '@services/core';
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
  CatalogueEnum,
  UnitManagersFormEnum, RoutesEnum
} from "@shared/enums";
import {debounceTime} from "rxjs";
import {AuthService, RolesHttpService, UsersHttpService} from "@services/auth";
import { RoleModel, UserModel } from '@models/auth';

@Component({
  selector: 'app-unit-manager-form',
  templateUrl: './unit-manager-form.component.html',
  styleUrl: './unit-manager-form.component.scss'
})
export class UnitManagerFormComponent implements OnInit, OnExitInterface{

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly UnitManagersFormEnum = UnitManagersFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected users: UserModel[] = [];
  protected roles: RoleModel[] = [];
  protected units: UnitModel[] = [];


  private saving: boolean = true;

  constructor(
    private readonly authService: AuthService,
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly unitManagersHttpService: UnitManagersHttpService,
    private readonly usersHttpService: UsersHttpService,
    private readonly rolesHttpService:RolesHttpService,
    private readonly unitsHttpService: UnitsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.UNIT_MANAGERS, routerLink: [this.routesService.unitManagersList]},
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
    this.loadUsers();
    this.loadUnits();
    this.loadRoles();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      user: [null, [Validators.required]],
      role: [null, [Validators.required]],
      unit: [null, [Validators.required]],
      code: [null, [Validators.required]],
      date: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.userField.errors) this.formErrors.push(UnitManagersFormEnum.user);
    if (this.roleField.errors) this.formErrors.push(UnitManagersFormEnum.role);
    if (this.unitField.errors) this.formErrors.push(UnitManagersFormEnum.unit);
    if (this.codeField.errors) this.formErrors.push(UnitManagersFormEnum.code);
    if (this.dateField.errors) this.formErrors.push(UnitManagersFormEnum.date);
    if (this.enabledField.errors) this.formErrors.push(UnitManagersFormEnum.enabled);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.unitManagersHttpService.findOne(this.id!).subscribe((unitManager) => {
      this.form.patchValue(unitManager);
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
    this.router.navigate([this.routesService.unitManagersList]);
  }

  create(unitManager: CreateUnitManagerDto): void {
    this.unitManagersHttpService.create(unitManager).subscribe(unitManager => {
      //this.form.reset(unitManager);
      this.back();
    });
  }

  update(unitManager: UpdateUnitManagerDto): void {
    this.unitManagersHttpService.update(this.id!, unitManager).subscribe((unitManager) => {
      //this.form.reset(unitManager);
      this.back()
    });
  }

  loadUnits(): void {
    this.unitsHttpService.findCatalogues().subscribe((units) => {
      this.units = units;
    });
  }

  loadRoles(): void {
    this.rolesHttpService.findCatalogues().subscribe((roles) => {
      this.roles = roles;
    });
  }

  loadUsers(): void {
    this.usersHttpService.findCatalogues().subscribe((users) => {
      this.users = users;
    });
  }

  get userField(): AbstractControl {
    return this.form.controls['user'];
  }

  get roleField(): AbstractControl {
    return this.form.controls['role'];
  }

  get unitField(): AbstractControl {
    return this.form.controls['unit'];
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get dateField(): AbstractControl {
    return this.form.controls['date'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }
}
