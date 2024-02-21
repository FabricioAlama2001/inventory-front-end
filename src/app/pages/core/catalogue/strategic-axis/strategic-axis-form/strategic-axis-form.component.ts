import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import { CreateStrategicAxisDto, UpdateStrategicAxisDto, } from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  RoutesService,
  StrategicAxesHttpService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
   RoutesEnum,
   StrategicAxesFormEnum
} from "@shared/enums";

@Component({
  selector: 'app-strategic-axis-form',
  templateUrl: './strategic-axis-form.component.html',
  styleUrl: './strategic-axis-form.component.scss'
})
export class StrategicAxisFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly StrategicAxesFormEnum = StrategicAxesFormEnum;
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
    private readonly strategicAxesHttpService: StrategicAxesHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.STRATEGIC_AXES, routerLink: [this.routesService.strategicAxesList]},
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
      code: [null, []],
      name: [null, []],
      enabled: [true, []],
      sort: [this.coreService.higherSort, []],
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

    if (this.codeField.errors) this.formErrors.push(StrategicAxesFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(StrategicAxesFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(StrategicAxesFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(StrategicAxesFormEnum.sort);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.strategicAxesHttpService.findOne(this.id!).subscribe((strategicAxis) => {
      this.form.patchValue(strategicAxis);
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
    this.router.navigate([this.routesService.strategicAxesList]);
  }

  create(strategicAxis: CreateStrategicAxisDto): void {
    this.strategicAxesHttpService.create(strategicAxis).subscribe(strategicAxis => {
      //this.form.reset(strategicAxis);
      this.saving = false;
      this.back();
    });
  }

  update(strategicAxis: UpdateStrategicAxisDto): void {
    this.strategicAxesHttpService.update(this.id!, strategicAxis).subscribe((strategicAxis) => {
      //this.form.reset(strategicAxis);
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
}
