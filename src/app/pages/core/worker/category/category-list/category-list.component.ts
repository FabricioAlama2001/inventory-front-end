import { Component, OnInit, inject } from '@angular/core';
import {BreadcrumbService, CategoriesHttpService, CoreService, MessageService, RoutesService} from '@services/core';
import {Router} from "@angular/router";
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {MenuItem,PrimeIcons} from "primeng/api";
import {CategoryModel, ColumnModel} from "@models/core";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  /** Services **/
  private readonly categoriesHttpService = inject(CategoriesHttpService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly router = inject(Router);
  private readonly routesService = inject(RoutesService);
  protected readonly coreService = inject(CoreService);
  protected readonly messageService = inject(MessageService);

  /** Enums **/
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly IdButtonActionEnum = IdButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly TableEnum = TableEnum;

  /** Buttons Actions **/
  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  /** Table **/
  protected columns: ColumnModel[] = this.buildColumns;
  protected items: CategoryModel[] = [];
  protected selectedItem!: CategoryModel;
  protected selectedItems: CategoryModel[] = [];
  // protected search: FormControl = new FormControl('');//Busqueada cuando hay paginado en el backend
  protected globalFilterFields: string[] = ['code', 'name'];//Busqueda cuando hay paginado en el frontend

  constructor() {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.APPLICATION_STATUS}]);
  }

  ngOnInit() {
    // this.checkValueChanges();
    this.findAll();
  }

  checkValueChanges() {
    // this.search.valueChanges.pipe(
    //   debounceTime(500)
    // ).subscribe(value => {
    //   this.findAll();
    // });
  }

  findAll() {
    this.categoriesHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
      });
  }

  // Para poner nombres y orden de las columnas de la tabla
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: 'Codigo'},
      {field: 'name', header: 'Name'},
      {field: 'enabled', header: 'Enable'}
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

  // Solo cambiar CategoryModel
  validateButtonActions(item: CategoryModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  // Solo cambiar la ruta del servicio
  redirectCreateForm() {
    this.router.navigate([this.routesService.categoriesForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.categoriesForm(id)]);
  }

  /** Actions **/
  // Solo cambiar categoriesHttpService
  disable(id: string) {
    this.categoriesHttpService.disable(id).subscribe(item => {
      const index = this.items.findIndex(disabledItem => disabledItem.id === id);
      this.items[index] = item;
    });
  }

  // Solo cambiar categoriesHttpService
  enable(id: string) {
    this.categoriesHttpService.enable(id).subscribe(item => {
      const index = this.items.findIndex(enabledItem => enabledItem.id === id);
      this.items[index] = item;
    });
  }

  // Solo cambiar categoriesHttpService
  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.categoriesHttpService.remove(id).subscribe((removedItem) => {
            this.items = this.items.filter(item => item.id !== removedItem.id);
          });
        }
      });
  }

  // Solo cambiar CategoryModel
  selectItem(item: CategoryModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
