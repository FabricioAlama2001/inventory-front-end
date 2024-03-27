import {Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons, TreeNode} from "primeng/api";

import {
  ApplicationStatusModel,
  CreateTransactionDto,
  DocumentTypeModel,
  ExpenseTypeModel,
  FiscalYearModel,
  ProjectModel,
  TransactionModel,
  UnitModel,
  UpdateTransactionDto
} from '@models/core';
import {
  ApplicationStatusHttpService,
  BreadcrumbService,
  CoreService,
  DocumentTypesHttpService,
  ExpenseTypesHttpService,
  FiscalYearsHttpService,
  MessageService,
  RoutesService,
  SubactivitiesHttpService,
  TransactionsHttpService,
  UnitsHttpService
} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {
  ApplicationStatusEnum,
  BreadcrumbEnum,
  ClassButtonActionEnum,
  DocumentTypeEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  RoutesEnum,
  SkeletonEnum,
  SubactivitiesFormEnum,
  TransactionsFormEnum
} from "@shared/enums";
import {AuthService} from "@services/auth";


@Component({
  selector: 'app-scp-form',
  templateUrl: './scp-form.component.html',
  styleUrl: './scp-form.component.scss',
})
export class ScpFormComponent implements OnInit, OnExitInterface {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly TransactionsFormEnum = TransactionsFormEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected readonly SubactivitiesFormEnum = SubactivitiesFormEnum;
  protected helpText: string = '';

  @Input({required:true}) id: string = '';
  protected form: FormGroup;
  private saving: boolean = true;
  protected formErrors: string[] = [];

  protected documentTypes: DocumentTypeModel[] = [];
  protected applicationStatus: ApplicationStatusModel[] = [];
  protected transactions: TransactionModel[] = [];
  protected fiscalYears: FiscalYearModel[] = [];
  protected units: UnitModel[] = [];
  protected expenseType: FormControl = new FormControl(null, [Validators.required]);
  protected expenseTypes: ExpenseTypeModel[] = [];
  protected projects!: TreeNode[];
  protected selectedSubactivity!: TreeNode;
  protected isProgrammingForm: boolean = false;

  private readonly expenseTypesHttpService = inject(ExpenseTypesHttpService);
  private readonly authService = inject(AuthService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  protected readonly coreService = inject(CoreService);
  private readonly formBuilder = inject(FormBuilder);
  public readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly routesService = inject(RoutesService);
  private readonly transactionsHttpService = inject(TransactionsHttpService);
  private readonly documentTypesHttpService = inject(DocumentTypesHttpService);
  private readonly applicationStatusHttpService = inject(ApplicationStatusHttpService);
  private readonly fiscalYearsHttpService = inject(FiscalYearsHttpService);
  private readonly unitsHttpService = inject(UnitsHttpService);
  private readonly subactivitiesHttpService = inject(SubactivitiesHttpService);

  constructor() {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.TRANSACTIONS, routerLink: [this.routesService.transactionsList]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if ((this.form.touched || this.form.dirty) && this.saving) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadDocumentTypes();
    this.loadApplicationStatus();
    this.loadTransactions();
    this.loadFiscalYears();
    this.loadUnits();
    this.loadExpenseTypes();

    if (this.id != RoutesEnum.NEW) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      code: [null, [Validators.required]],
      date: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      esigef: [null, [Validators.required]],
      value: [null, [Validators.required]],
      isIva: [true, [Validators.required]],
      description: [null, [Validators.required]],
      enabled: [true, [Validators.required]],
      state: [true, [Validators.required]],
      documentType: [null, [Validators.required]],
      applicationStatus: [null, [Validators.required]],
      parent: [null, []],
      process: [null, []],
      fiscalYear: [this.authService.fiscalYear, [Validators.required]],
      unit: [this.authService.unit, [Validators.required]],
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.codeField.errors) this.formErrors.push(TransactionsFormEnum.code);
    if (this.subjectField.errors) this.formErrors.push(TransactionsFormEnum.subject);
    if (this.esigefField.errors) this.formErrors.push(TransactionsFormEnum.esigef);
    if (this.valueField.errors) this.formErrors.push(TransactionsFormEnum.value);
    if (this.isIvaField.errors) this.formErrors.push(TransactionsFormEnum.isIva);
    if (this.descriptionField.errors) this.formErrors.push(TransactionsFormEnum.description);
    if (this.enabledField.errors) this.formErrors.push(TransactionsFormEnum.enabled);
    if (this.stateField.errors) this.formErrors.push(TransactionsFormEnum.state);
    if (this.documentTypeField.errors) this.formErrors.push(TransactionsFormEnum.documentType);
    if (this.applicationStatusField.errors) this.formErrors.push(TransactionsFormEnum.applicationStatus);
    if (this.parentField.errors) this.formErrors.push(TransactionsFormEnum.parent);
    if (this.processField.errors) this.formErrors.push(TransactionsFormEnum.process);
    if (this.fiscalYearField.errors) this.formErrors.push(TransactionsFormEnum.fiscalYear);
    if (this.unitField.errors) this.formErrors.push(TransactionsFormEnum.unit);

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.transactionsHttpService.findOne(this.id!).subscribe((transaction) => {
      this.form.patchValue(transaction);
    });
  }

  onSubmit(): void {
    if (this.validateFormErrors) {
      this.saving = false;

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
    this.router.navigate([this.routesService.transactionsList]);
  }

  create(transaction: CreateTransactionDto): void {
    this.transactionsHttpService.create(transaction).subscribe(transaction => {
      //this.form.reset(transaction);
      this.back();
    });
  }

  update(transaction: UpdateTransactionDto): void {
    this.transactionsHttpService.update(this.id!, transaction).subscribe((transaction) => {
      //this.form.reset(transaction);
      this.back()
    });
  }

  openProgrammingForm(event: any) {
    if (event.data) {
      this.isProgrammingForm = true;
      // this.router.navigate([this.routesService.programingFormApplicant(event.key)]);
    }
  }

  loadDocumentTypes(): void {
    this.documentTypesHttpService.findCatalogues().subscribe((documentTypes) => {
      this.documentTypes = documentTypes.filter(documentType => documentType.code === DocumentTypeEnum.SCP);
      if (this.documentTypes.length)
        this.documentTypeField.patchValue(this.documentTypes[0]);
    });
  }

  loadApplicationStatus(): void {
    this.applicationStatusHttpService.findCatalogues().subscribe((applicationStatus) => {
      this.applicationStatus = applicationStatus.filter(applicationStatus => applicationStatus.code === ApplicationStatusEnum.elaborated);
      if (this.applicationStatus.length)
        this.applicationStatusField.patchValue(this.applicationStatus[0]);
    });
  }

  loadTransactions(): void {
    this.transactionsHttpService.findCatalogues().subscribe((transactions) => {
      this.transactions = transactions;
    });
  }

  loadFiscalYears(): void {
    this.fiscalYears = [this.authService.fiscalYear];
  }

  loadUnits(): void {
    this.units = [this.authService.unit];
  }

  loadSubactivities(): void {
    this.subactivitiesHttpService.findSubactivitiesByExpenseType(this.expenseType.value.id, this.form.value)
      .subscribe((projects) => {
        this.convertSubactivitiesToTreeNode(projects)
      });
  }

  private convertSubactivitiesToTreeNode(projects: ProjectModel[]) {
    this.projects = [];

    projects.forEach(project => {
      project.components.forEach(component => {
        const activities: TreeNode[] = [];
        component.activities.forEach(activity => {
          const subactivities: TreeNode[] = [];
          activity.subactivities.forEach(subactivity => {
            subactivities.push({
              key: subactivity.id,
              label: '(Subactividad) ' + subactivity.name,
              icon: PrimeIcons.EXTERNAL_LINK,
              data: true,
            });
          });

          activities.push({
            key: activity.id,
            label: '(Actividad) ' + activity.name,
            icon: PrimeIcons.BOOKMARK,
            data: false,
            children: subactivities
          });
        });

        const components: TreeNode[] = [];
        components.push({
          key: component.id,
          label: '(Componente) ' + component.name,
          icon: PrimeIcons.TAG,
          data: false,
          children: activities
        });

        this.projects.push({
          key: project.id,
          label: '(Proyecto) ' + project.name,
          icon: PrimeIcons.BOOK,
          data: false,
          children: components
        });
      });
    });
  }

  expandNode(event: any) {
    event.node.expanded = true;
  }

  collapseNode(event: any) {
    event.node.expanded = false;
  }

  loadExpenseTypes(): void {
    this.expenseTypesHttpService.findCatalogues().subscribe((expenseTypes) => {
      this.expenseTypes = expenseTypes;
    });
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get subjectField(): AbstractControl {
    return this.form.controls['subject'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get esigefField(): AbstractControl {
    return this.form.controls['esigef'];
  }

  get valueField(): AbstractControl {
    return this.form.controls['value'];
  }

  get isIvaField(): AbstractControl {
    return this.form.controls['isIva'];
  }

  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }

  get stateField(): AbstractControl {
    return this.form.controls['state'];
  }

  get documentTypeField(): AbstractControl {
    return this.form.controls['documentType'];
  }

  get applicationStatusField(): AbstractControl {
    return this.form.controls['applicationStatus'];
  }

  get parentField(): AbstractControl {
    return this.form.controls['parent'];
  }

  get processField(): AbstractControl {
    return this.form.controls['process'];
  }

  get fiscalYearField(): AbstractControl {
    return this.form.controls['fiscalYear'];
  }

  get unitField(): AbstractControl {
    return this.form.controls['unit'];
  }

  get dateField(): AbstractControl {
    return this.form.controls['date'];
  }
}

