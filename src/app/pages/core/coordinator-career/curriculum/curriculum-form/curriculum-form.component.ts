import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PrimeIcons} from "primeng/api";
import {OnExitInterface} from "@shared/interfaces";
import {CatalogueModel, CurriculumModel} from "@models/core";
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  MessageService,
  RoutesService,
  CurriculumsHttpService, CareersService
} from "@services/core";
import {
    BreadcrumbEnum,
    CatalogueTypeEnum,
    ClassButtonActionEnum, IconButtonActionEnum,
    LabelButtonActionEnum,
    SkeletonEnum
} from "@shared/enums";
import {isAfter, isBefore} from "date-fns";

@Component({
  selector: 'app-curriculum-form',
  templateUrl: './curriculum-form.component.html',
  styleUrls: ['./curriculum-form.component.scss']
})
export class CurriculumFormComponent implements OnInit, OnExitInterface {
  protected readonly PrimeIcons = PrimeIcons;
  protected id: string | null = null;
  protected form: FormGroup;

  // Foreign Keys
  protected states: CatalogueModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private curriculumsHttpService: CurriculumsHttpService,
    private careersService: CareersService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONS, routerLink: routesService.institutions},
      {label: BreadcrumbEnum.CAREERS, routerLink: routesService.careers},
      {label: BreadcrumbEnum.CURRICULUMS, routerLink: [this.routesService.curriculums]},
      {label: BreadcrumbEnum.FORM},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
    }

    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched && this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadStates();

    if (this.id) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      career: [this.careersService.career, [Validators.required]],
      state: [null, [Validators.required]],
      isVisible: [true, [Validators.required]],
      code: [null, [Validators.required, Validators.minLength(3)]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.minLength(10)]],
      resolutionNumber: [null, [Validators.required]],
      periodicAcademicNumber: [null, [Validators.required]],
      weeksNumber: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id) {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields();
    }
  }

  back(): void {
    this.router.navigate([this.routesService.curriculums]);
  }

  /** Actions **/
  create(item: CurriculumModel): void {
    this.curriculumsHttpService.create(item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  update(item: CurriculumModel): void {
    this.curriculumsHttpService.update(this.id!, item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  /** Load Data **/
  get(): void {
    this.curriculumsHttpService.findOne(this.id!).subscribe((item) => {
      this.form.patchValue(item);
    });
  }

  loadStates(): void {
    this.states = this.cataloguesHttpService.findByType(CatalogueTypeEnum.CURRICULUMS_STATE);
  }

  /** Form Getters **/
  get careerField(): AbstractControl {
    return this.form.controls['career'];
  }

  get stateField(): AbstractControl {
    return this.form.controls['state'];
  }

  get isVisibleField(): AbstractControl {
    return this.form.controls['isVisible']
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }

  get resolutionNumberField(): AbstractControl {
    return this.form.controls['resolutionNumber'];
  }

  get periodicAcademicNumberField(): AbstractControl {
    return this.form.controls['periodicAcademicNumber'];
  }

  get weeksNumberField(): AbstractControl {
    return this.form.controls['weeksNumber'];
  }

  protected readonly SkeletonEnum = SkeletonEnum;
    protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
    protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
    protected readonly IconButtonActionEnum = IconButtonActionEnum;
}
