
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import {CreateProjectDto, UpdateProjectDto} from '@models/core';
import {CatalogueModel} from "@models/core";
import { PndObjectivesHttpService } from '@services/core/pnd-objectives-http.services';
import { PndPolicesHttpService } from '@services/core/pnd-polices-http.service';
import { ExpenseTypesHttpService } from '@services/core/expense-types-http.services';
import {BreadcrumbService, CataloguesHttpService, CoreService, MessageService, ProjectsHttpService, RoutesService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  BreadcrumbEnum,
  CatalogueTypeEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SubactivitiesFormEnum,
  SkeletonEnum, UsersFormEnum,
  UsersIdentificationTypeStateEnum,
  CatalogueEnum,
  ProjectsFormEnum
} from "@shared/enums";



@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly SubactivitiesFormEnum = SubactivitiesFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected helpText: string = '';

  @Input() id: string = '';
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected pndObjectives: CatalogueModel[] = [];
  protected pndPolices: CatalogueModel[] = [];
  protected expenseTypes: CatalogueModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,

    private readonly projectsHttpService: ProjectsHttpService,
    private readonly pndObjectivesHttpService: PndObjectivesHttpService,
    private readonly pndPolicesHttpService: PndPolicesHttpService,
    private readonly expenseTypesHttpService: ExpenseTypesHttpService,
  


  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.SUBACTIVITIES, routerLink: [this.routesService.subactivities]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.form = this.newForm;
  }
  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    if (this.id != 'new') {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, []],
      fiscalYear: [null, []],
      enabled: [null, []],
      pndObjectives: [null, []],
      pndPolices: [null, []],
      expenseTypes: [null, []],
    
    });
  }
  get validateFormErrors() {
    this.formErrors = [];

    if (this.nameField.errors) this.formErrors.push(ProjectsFormEnum.name);
    if (this.fiscalYearField.errors) this.formErrors.push(ProjectsFormEnum.fiscalYear);
    if (this.enabledField.errors) this.formErrors.push(ProjectsFormEnum.enabled);
    if (this.pndObjectiveField.errors) this.formErrors.push(ProjectsFormEnum.pndObjective);
    if (this.pndPoliceField.errors) this.formErrors.push(ProjectsFormEnum.pndPolice);
    if (this.expenseTypeField.errors) this.formErrors.push(ProjectsFormEnum.expenseType);
  
    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }
  get(): void {
    this.projectsHttpService.findOne(this.id!).subscribe((project) => {
      this.form.patchValue(project);
    });
  }

  onSubmit(): void {
    if (this.validateFormErrors) {
      if (this.id) {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  back(): void {
    this.router.navigate([this.routesService.projects]);
  }

  create(project: CreateProjectDto): void {
    this.projectsHttpService.create(project).subscribe(project => {
      //this.form.reset(project);
      this.back();
    });
  }

  update(project: UpdateProjectDto): void {
    this.projectsHttpService.update(this.id!, project).subscribe((project) => {
      //this.form.reset(project);
      this.back()
    });
  }

  loadPndObjectives(): void {
    this.pndObjectives = this.pndObjectivesHttpService.findCatalogue(CatalogueEnum.PND_OBJECTIVE);
  }

  loadPndPolices(): void {
    this.pndPolices = this.pndPolicesHttpService.findCatalogue(CatalogueEnum.PND_POLICE);
  }

  loadExpeseTypes(): void {
    this.expenseTypes = this.expenseTypesHttpService.findCatalogue(CatalogueEnum.EXPENSE_TYPE);
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

  get pndObjectiveField(): AbstractControl {
    return this.form.controls['pndObjective'];
  }

  get pndPoliceField(): AbstractControl {
    return this.form.controls['pndPolice'];
  }

  get expenseTypeField(): AbstractControl {
    return this.form.controls['expenseType'];
  }

}
