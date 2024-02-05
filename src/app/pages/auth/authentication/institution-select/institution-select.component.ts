import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PrimeIcons} from "primeng/api";
import {CareerModel, SelectInstitutionDto} from "@models/core";
import {AuthService} from '@services/auth';
import {CareersService, CoreService, InstitutionsService, MessageService, RoutesService} from '@services/core';

@Component({
  selector: 'app-institution-select',
  templateUrl: './institution-select.component.html',
  styleUrls: ['./institution-select.component.scss']
})
export class InstitutionSelectComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected form: FormGroup;
  protected institutions: SelectInstitutionDto[] = [];
  protected careers: CareerModel[] = [];

  constructor(
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    private institutionsService: InstitutionsService,
    private careersService: CareersService,
    public messageService: MessageService,
    protected authService: AuthService,
    protected routesService: RoutesService) {
    this.form = this.newForm();

    this.institutionField.valueChanges.subscribe(institution => {
      this.careers = this.careersService.careers.filter(career => career.institution?.id === institution.id);

      if (this.careers.length === 0) this.careerField.clearValidators();
      else this.careerField.setValidators(Validators.required);

      if (this.careers.length === 1) this.careerField.patchValue(this.careers[0]);
      this.careerField.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.institutions = this.institutionsService.institutions;
    if (this.institutions.length === 1) this.institutionField.patchValue(this.institutions[0]);
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      institution: [null, [Validators.required]],
      career: [null, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.selectInstitution();
    } else {
      this.form.markAllAsTouched();
    }
  }

  selectInstitution() {
    this.institutionsService.institution = this.institutionField.value;

    const career = this.careersService.careers.find(career => career.institution?.id === this.institutionsService.institution.id)

    if (career) this.careersService.career = career;

    this.authService.selectDashboard();
  }

  get institutionField() {
    return this.form.controls['institution'];
  }

  get careerField() {
    return this.form.controls['career'];
  }
}
