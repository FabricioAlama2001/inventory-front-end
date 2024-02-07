import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PrimeIcons} from "primeng/api";
import {RolesEnum} from "@shared/enums";
import {RoleModel} from "@models/auth";
import {AuthService} from '@services/auth';
import {CoreService, MessageService, RoutesService} from '@services/core';

@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.scss']
})
export class RoleSelectComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected form: FormGroup;
  protected roles: RoleModel[] = [];
  protected fiscalYears: RoleModel[] = [];
  protected units: RoleModel[] = [];

  constructor(
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    public messageService: MessageService,
    protected authService: AuthService,
    protected routesService: RoutesService) {
    this.form = this.newForm();
  }

  ngOnInit(): void {
    this.roles = this.authService.roles;
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
        role: [null, [Validators.required]],
        fiscalYear: [null, []],
        unit: [null, []],
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

    if (this.authService.role.code === RolesEnum.ADMIN) {
      this.authService.selectDashboard();
      return;
    }
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
}
