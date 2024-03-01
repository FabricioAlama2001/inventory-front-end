import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {
  CreateComponentDto,
  FiscalYearModel,
  IndicatorComponentModel,
  ProjectModel,
  UpdateComponentDto
} from '@models/core';
import {
  BreadcrumbService,
  ComponentsHttpService,
  CoreService,
  FiscalYearsHttpService,
  IndicatorComponentsHttpService,
  MessageService,
  ProjectsHttpService,
  RoutesService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
  ComponentsFormEnum, RoutesEnum
} from "@shared/enums";

@Component({
  selector: 'app-component-form',
  templateUrl: './component-form.component.html',
  styleUrl: './component-form.component.scss'
})
export class ComponentFormComponent implements OnInit, OnExitInterface {
  @Input({alias: 'projectId'}) projectId: string = '';
  @Input({alias: 'componentId'}) id: string = '';

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ComponentsFormEnum = ComponentsFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected indicators: IndicatorComponentModel[] = [];
  protected projects: ProjectModel[] = [];
  protected fiscalYears: FiscalYearModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly projectsHttpService: ProjectsHttpService,
    private readonly indicatorComponentsHttpService: IndicatorComponentsHttpService,
    private readonly componentsHttpService: ComponentsHttpService,
    private readonly fiscalYearsHttpService: FiscalYearsHttpService,

  ) {
    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.PROJECTS, routerLink: [this.routesService.projectsList]},
      {label: BreadcrumbEnum.COMPONENTS, routerLink: [this.routesService.componentsList(this.projectId)]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.loadIndicatorComponents();
    this.loadProjects();
    this.loadFiscalYears();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      fiscalYear: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
      indicatorComponent: [null, [Validators.required]],
      project: [null, [Validators.required]],
    });
  }

  get validateFormErrors() {
    this.formErrors = [];
    if (this.indicatorComponentField.errors) this.formErrors.push(ComponentsFormEnum.indicatorComponent);
    if (this.projectField.errors) this.formErrors.push(ComponentsFormEnum.project);
    if (this.codeField.errors) this.formErrors.push(ComponentsFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(ComponentsFormEnum.name);
    if (this.fiscalYearField.errors) this.formErrors.push(ComponentsFormEnum.fiscalYear);
    if (this.enabledField.errors) this.formErrors.push(ComponentsFormEnum.enabled);


    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.componentsHttpService.findOne(this.id!).subscribe((project) => {
      this.form.patchValue(project);
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
    this.router.navigate([this.routesService.componentsList(this.projectId)]);
  }

  create(project: CreateComponentDto): void {
    this.componentsHttpService.create(project).subscribe(project => {
      //this.form.reset(project);
      this.back();
    });
  }

  update(project: UpdateComponentDto): void {
    this.componentsHttpService.update(this.id!, project).subscribe((project) => {
      //this.form.reset(project);
      this.back()
    });
  }

  loadIndicatorComponents(): void {
    this.indicatorComponentsHttpService.findCatalogues().subscribe((indicators) => {
      this.indicators = indicators;
    });
  }

  loadFiscalYears(): void {
    this.fiscalYearsHttpService.findCatalogues().subscribe((fiscalYears) => {
      this.fiscalYears = fiscalYears;
    });
  }

  loadProjects(): void {
    this.projectsHttpService.findCatalogues().subscribe((projects) => {
      this.projects = projects;
      this.projectField.patchValue(this.projects.find(item => item.id === this.projectId));
    });
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get fiscalYearField(): AbstractControl {
    return this.form.controls['fiscalYear'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get indicatorComponentField(): AbstractControl {
    return this.form.controls['indicatorComponent'];
  }

  get projectField(): AbstractControl {
    return this.form.controls['project'];
  }
}
