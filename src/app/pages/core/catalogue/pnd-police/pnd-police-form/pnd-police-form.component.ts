import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreatePndPoliceDto, PndObjectiveModel, UpdatePndPoliceDto} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  PndObjectivesHttpService,
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
   PndPolicesFormEnum
} from "@shared/enums";

@Component({
  selector: 'app-pnd-police-form',
  templateUrl: './pnd-police-form.component.html',
  styleUrl: './pnd-police-form.component.scss'
})
export class PndPoliceFormComponent implements OnInit, OnExitInterface{
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PndPolicesFormEnum = PndPolicesFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';
  private saving: boolean = true;

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected pndObjectives: PndObjectiveModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly pndPolicesHttpService: PndPolicesHttpService,
    private readonly pndObjectivesHttpService: PndObjectivesHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.PND_POLICES, routerLink: [this.routesService.pndPolicesList]},
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
    this.loadPndObjectives();

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
      pndObjective: [null, [Validators.required]],
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

    if (this.codeField.errors) this.formErrors.push(PndPolicesFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(PndPolicesFormEnum.name);
    if (this.enabledField.errors) this.formErrors.push(PndPolicesFormEnum.enabled);
    if (this.sortField.errors) this.formErrors.push(PndPolicesFormEnum.sort);
    if (this.pndObjectiveField.errors) this.formErrors.push(PndPolicesFormEnum.pndObjective);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.pndPolicesHttpService.findOne(this.id!).subscribe((pndPolice) => {
      this.form.patchValue(pndPolice);
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
    this.router.navigate([this.routesService.pndPolicesList]);
  }

  create(pndPolice: CreatePndPoliceDto): void {
    this.pndPolicesHttpService.create(pndPolice).subscribe(pndPolice => {
      //this.form.reset(pndPolice);
      this.saving = false;
      this.back();
    });
  }

  update(pndPolice: UpdatePndPoliceDto): void {
    this.pndPolicesHttpService.update(this.id!, pndPolice).subscribe((pndPolice) => {
      //this.form.reset(pndPolice);
      this.saving = false;
      this.back()
    });
  }

  loadPndObjectives(): void {
    this.pndObjectivesHttpService.findCatalogues().subscribe((pndObjectives) => {
      this.pndObjectives = pndObjectives;
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

  get pndObjectiveField(): AbstractControl {
    return this.form.controls['pndObjective'];
  }
}
