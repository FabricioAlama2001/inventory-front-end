import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PrimeIcons} from "primeng/api";

import { CreateDocumentTypeDto, UpdateDocumentTypeDto, } from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  DocumentTypesHttpService,
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
   DocumentTypesFormEnum
} from "@shared/enums";

@Component({
  selector: 'app-document-type-form',
  templateUrl: './document-type-form.component.html',
  styleUrl: './document-type-form.component.scss'
})
export class DocumentTypeFormComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly DocumentTypesFormEnum = DocumentTypesFormEnum;
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
    private readonly documentTypesHttpService: DocumentTypesHttpService
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.DOCUMENT_TYPES, routerLink: [this.routesService.documentTypesList]},
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
      description: [null, [Validators.required]],
      acronym: [null, [Validators.required]],
      enabled: [true, [Validators.required]],

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

    if (this.codeField.errors) this.formErrors.push(DocumentTypesFormEnum.code);
    if (this.nameField.errors) this.formErrors.push(DocumentTypesFormEnum.name);
    if (this.descriptionField.errors) this.formErrors.push(DocumentTypesFormEnum.description);
    if (this.acronymField.errors) this.formErrors.push(DocumentTypesFormEnum.acronym);
    if (this.enabledField.errors) this.formErrors.push(DocumentTypesFormEnum.enabled);


    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  get(): void {
    this.documentTypesHttpService.findOne(this.id!).subscribe((documentType) => {
      this.form.patchValue(documentType);
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
    this.router.navigate([this.routesService.documentTypesList]);
  }

  create(documentType: CreateDocumentTypeDto): void {
    this.documentTypesHttpService.create(documentType).subscribe(documentType => {
      //this.form.reset(documentType);
      this.saving = false;
      this.back();
    });
  }

  update(documentType: UpdateDocumentTypeDto): void {
    this.documentTypesHttpService.update(this.id!, documentType).subscribe((documentType) => {
      //this.form.reset(documentType);
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

  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }

  get acronymField(): AbstractControl {
    return this.form.controls['acronym'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }


}
