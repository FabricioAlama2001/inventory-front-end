import {Component, OnInit, inject} from '@angular/core';
import {
  BreadcrumbService,
  CategoriesHttpService,
  CoreService,
  MessageService,
  ProductsHttpService,
  RoutesService
} from '@services/core';
import {Router} from "@angular/router";
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {MenuItem, PrimeIcons} from "primeng/api";
import {CategoryModel, ColumnModel, PaginatorModel, ProductModel} from "@models/core";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  /** Services **/
    // private readonly categoriesHttpService = inject(CategoriesHttpService);
  private readonly productsHttpService = inject(ProductsHttpService);
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
  protected items: ProductModel[] = [];
  protected selectedItem!: ProductModel;
  protected selectedItems: ProductModel[] = [];
  protected search: FormControl = new FormControl('');
  protected paginator!: PaginatorModel;

  constructor() {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.PRODUCTS}
    ]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findProducts();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findProducts();
    });
  }

  findProducts(page: number = 0) {
    this.productsHttpService.findProducts(page,this.search.value)
      .subscribe((response) => {
        this.items = response.data;
        this.paginator = response.pagination!;
      });
  }

  // Para poner nombres y orden de las columnas de la tabla
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'category', header: 'Categoría'},
      {field: 'name', header: 'Producto'},
      {field: 'enabled', header: 'Estado'},
      {field: 'stock', header: 'Stock'}
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

  // Solo cambiar ProductModel
  validateButtonActions(item: ProductModel): void {
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
    this.productsHttpService.disable(id).subscribe(item => {
      const index = this.items.findIndex(disabledItem => disabledItem.id === id);
      this.items[index] = item;
    });
  }

  // Solo cambiar categoriesHttpService
  enable(id: string) {
    this.productsHttpService.enable(id).subscribe(item => {
      const index = this.items.findIndex(enabledItem => enabledItem.id === id);
      this.items[index] = item;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.productsHttpService.remove(id).subscribe((removedItem) => {
            this.items = this.items.filter(item => item.id !== removedItem.id);
          });
        }
      });
  }

  selectItem(item: ProductModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }

  paginate(event: any) {
    this.findProducts(event.page);
  }

}
