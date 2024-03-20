import {Component, inject, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";
import {CreateApplicationStatusDto, UpdateApplicationStatusDto} from '@models/core';
import {
  ApplicationStatusHttpService,
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
import {getSlug} from '@shared/helpers';

@Component({
  selector: 'app-application-status-form',
  templateUrl: './application-status-form.component.html',
  styleUrl: './application-status-form.component.scss'
})
export class ApplicationStatusFormComponent implements OnInit, OnExitInterface {
  /** Services **/
  private readonly applicationStatusHttpService = inject(ApplicationStatusHttpService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly routesService = inject(RoutesService);
  protected readonly coreService = inject(CoreService);
  public readonly messageService = inject(MessageService);

  /** Form **/
  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  /** Enums **/
  protected readonly ApplicationStatusFormEnum = ApplicationStatusFormEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;

  /** Helpers **/
  protected helpText: string = '';

  private saving: boolean = true;

  constructor() {
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

  /** Form **/
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

  /** Actions **/
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
      this.saving = false;
      this.back();
    });
  }

  update(applicationStatus: UpdateApplicationStatusDto): void {
    this.applicationStatusHttpService.update(this.id!, applicationStatus).subscribe((applicationStatus) => {
      this.saving = false;
      this.back()
    });
  }

  /** Getters **/
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
