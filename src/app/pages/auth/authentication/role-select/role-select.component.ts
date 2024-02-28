import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PrimeIcons} from "primeng/api";
import {RoleModel} from "@models/auth";
import {AuthService} from '@services/auth';
import {CoreService, FiscalYearsHttpService, MessageService, RoutesService, UnitsHttpService} from '@services/core';
import {FiscalYearModel, UnitModel} from "@models/core";
import {RoleEnum} from "@shared/enums";

@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.scss']
})
export class RoleSelectComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected form: FormGroup;
  protected roles: RoleModel[] = [];
  protected fiscalYears: FiscalYearModel[] = [];
  protected units: UnitModel[] = [];

  constructor(
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    public messageService: MessageService,
    protected authService: AuthService,
    protected routesService: RoutesService,
    private fiscalYearsHttpService: FiscalYearsHttpService,
    private unitsHttpService: UnitsHttpService,
  ) {
    this.form = this.newForm();

    this.roleField.valueChanges.subscribe(value => {
      if(value.code === RoleEnum.ADMIN || value.code === RoleEnum.CATALOGUE){
        this.unitField.clearValidators();
        this.fiscalYearField.clearValidators();
      }else{
        this.unitField.setValidators(Validators.required);
        this.fiscalYearField.setValidators(Validators.required);
      }
    });
  }

  ngOnInit(): void {
    this.loadFiscalYears();
    this.loadUnits();
    this.roles = this.authService.roles;
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
        role: [null, [Validators.required]],
        fiscalYear: [null],
        unit: [null],
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.selectRole();
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields();
    }
  }

  selectRole() {
    this.authService.role = this.roleField.value;
    this.authService.fiscalYear = this.fiscalYearField.value;
    this.authService.unit = this.unitField.value;

    this.authService.selectDashboard();
  }

  loadFiscalYears() {
    this.fiscalYearsHttpService.findCatalogues().subscribe(fiscalYears => {
      this.fiscalYears = fiscalYears;
    });
  }

  loadUnits() {
    this.unitsHttpService.findCatalogues().subscribe(units => {
      this.units = units;
    });
  }

  get roleField() {
    return this.form.controls['role'];
  }

  get fiscalYearField() {
    return this.form.controls['fiscalYear'];
  }

  get unitField() {
    return this.form.controls['unit'];
  }

  protected readonly Validators = Validators;
}
