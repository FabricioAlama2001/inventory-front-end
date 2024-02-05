import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PrimeIcons} from "primeng/api";
import {RolesEnum} from "@shared/enums";
import {RoleModel} from "@models/auth";
import {AuthService} from '@services/auth';
import {CareersService, CoreService, InstitutionsService, MessageService, RoutesService} from '@services/core';

@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.scss']
})
export class RoleSelectComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected form: FormGroup;
  protected roles: RoleModel[] = [];

  constructor(
    protected coreService: CoreService,
    private institutionsService: InstitutionsService,
    private careersService: CareersService,
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
    return this.formBuilder.group({role: [null, [Validators.required]]});
  }

  onSubmit() {
    if (this.form.valid) {
      this.selectRole();
    } else {
      this.form.markAllAsTouched();
    }
  }

  selectRole() {
    this.authService.role = this.roleField.value;

    if (this.authService.role.code === RolesEnum.ADMIN) {
      this.authService.selectDashboard();
      return;
    }

    if (this.institutionsService.institutions.length === 1) {
      this.institutionsService.institution = this.institutionsService.institutions[0];
      this.authService.selectDashboard();
    } else {
      this.routesService.institutionSelect();
    }
  }

  get roleField() {
    return this.form.controls['role'];
  }
}
