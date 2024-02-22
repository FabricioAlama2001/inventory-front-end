import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreateFundingSourceDto, UpdateFundingSourceDto} from '@models/core';
import {
  BreadcrumbService,
  FundingSourcesHttpService,
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
   FundingSourcesFormEnum
} from "@shared/enums";

@Component({
  selector: 'app-funding-source-form',
  templateUrl: './funding-source-form.component.html',
  styleUrl: './funding-source-form.component.scss'
})
export class FundingSourceFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly FundingSourcesFormEnum = FundingSourcesFormEnum;
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
    private readonly fundingSourcesHttpService: FundingSourcesHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.FUNDING_SOURCES, routerLink: [this.routesService.fundingSourcesList]},
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

    if (this.codeField.errors) this.formErrors.push(FundingSourcesFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(FundingSourcesFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(FundingSourcesFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(FundingSourcesFormEnum.sort);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.fundingSourcesHttpService.findOne(this.id!).subscribe((fundingSource) => {
      this.form.patchValue(fundingSource);
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
    this.router.navigate([this.routesService.fundingSourcesList]);
  }

  create(fundingSource: CreateFundingSourceDto): void {
    this.fundingSourcesHttpService.create(fundingSource).subscribe(fundingSource => {
      //this.form.reset(fundingSource);
      this.saving = false;
      this.back();
    });
  }

  update(fundingSource: UpdateFundingSourceDto): void {
    this.fundingSourcesHttpService.update(this.id!, fundingSource).subscribe((fundingSource) => {
      //this.form.reset(fundingSource);
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
