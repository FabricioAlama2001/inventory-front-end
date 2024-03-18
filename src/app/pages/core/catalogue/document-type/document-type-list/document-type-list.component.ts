import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {DocumentTypeModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, DocumentTypesHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  DocumentTypesFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";

@Component({
  selector: 'app-document-type-list',
  templateUrl: './document-type-list.component.html',
  styleUrl: './document-type-list.component.scss'
})
export class DocumentTypeListComponent {

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly DocumentTypesFormEnum = DocumentTypesFormEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: DocumentTypeModel;
  protected selectedItems: DocumentTypeModel[] = [];
  protected items: DocumentTypeModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly documentTypesHttpService: DocumentTypesHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.DOCUMENT_TYPES}]);
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findAll();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findAll();
    });
  }

  findAll() {
    this.documentTypesHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: DocumentTypesFormEnum.code},
      {field: 'name', header: DocumentTypesFormEnum.name},
      {field: 'description', header: DocumentTypesFormEnum.description},
      {field: 'acronym', header: DocumentTypesFormEnum.acronym},
      {field: 'sort', header: DocumentTypesFormEnum.sort},
      {field: 'enabled', header: DocumentTypesFormEnum.enabled},
    ];
  }

  get buildButtonActions(): MenuItem[] {
    return [
      {
        id: IdButtonActionEnum.UPDATE,
        label: LabelButtonActionEnum.UPDATE,
        icon: IconButtonActionEnum.UPDATE,
        command: () => {
          if (this.selectedItem?.id) this.redirectEditForm(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.DELETE,
        label: LabelButtonActionEnum.DELETE,
        icon: IconButtonActionEnum.DELETE,
        command: () => {
          if (this.selectedItem?.id) this.remove(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.DISABLE,
        label: LabelButtonActionEnum.DISABLE,
        icon: IconButtonActionEnum.DISABLE,
        command: () => {
          if (this.selectedItem?.id) this.disable(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.ENABLE,
        label: LabelButtonActionEnum.ENABLE,
        icon: IconButtonActionEnum.ENABLE,
        command: () => {
          if (this.selectedItem?.id) this.enable(this.selectedItem.id);
        },
      },
    ];
  }

  validateButtonActions(item: DocumentTypeModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.documentTypesForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.documentTypesForm(id)]);
  }

  disable(id: string) {
    this.documentTypesHttpService.disable(id).subscribe(documentType => {
      const index = this.items.findIndex(documentType => documentType.id === id);
      this.items[index] = documentType;
    });
  }

  enable(id: string) {
    this.documentTypesHttpService.enable(id).subscribe(documentType => {
      const index = this.items.findIndex(documentType => documentType.id === id);
      this.items[index] = documentType;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.documentTypesHttpService.remove(id).subscribe((documentType) => {
            this.items = this.items.filter(item => item.id !== documentType.id);
          });
        }
      });
  }

  selectItem(item: DocumentTypeModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
