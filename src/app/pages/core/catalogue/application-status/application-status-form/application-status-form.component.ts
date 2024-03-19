import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreateApplicationStatusDto, UpdateApplicationStatusDto} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
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
   ApplicationStatusFormEnum
} from "@shared/enums";
import { ApplicationStatusHttpService } from '@services/core/application-status-http.service';
import { getSlug } from '@shared/helpers/slug.helper';

@Component({
  selector: 'app-application-status-form',
  templateUrl: './application-status-form.component.html',
  styleUrl: './application-status-form.component.scss'
})
export class ApplicationStatusFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ApplicationStatusFormEnum = ApplicationStatusFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';
  private saving: boolean = true;

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly applicationStatusHttpService: ApplicationStatusHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.APPLICATION_STATUS, routerLink: [this.routesService.applicationStatusList]},
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
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
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

    if (this.codeField.errors) this.formErrors.push(ApplicationStatusFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(ApplicationStatusFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(ApplicationStatusFormEnum.enabled);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.applicationStatusHttpService.findOne(this.id!).subscribe((applicationStatus) => {
      this.form.patchValue(applicationStatus);
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
    this.router.navigate([this.routesService.applicationStatusList]);
  }

  create(applicationStatus: CreateApplicationStatusDto): void {
    this.applicationStatusHttpService.create(applicationStatus).subscribe(applicationStatus => {
      //this.form.reset(applicationStatus);
      this.saving = false;
      this.back();
    });
  }

  update(applicationStatus: UpdateApplicationStatusDto): void {
    this.applicationStatusHttpService.update(this.id!, applicationStatus).subscribe((applicationStatus) => {
      //this.form.reset(applicationStatus);
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
}
