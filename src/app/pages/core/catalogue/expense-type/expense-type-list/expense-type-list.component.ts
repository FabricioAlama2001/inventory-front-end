import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ExpenseTypeModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, ExpenseTypesHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  ExpenseTypesFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";

@Component({
  selector: 'app-expense-type-list',
  templateUrl: './expense-type-list.component.html',
  styleUrl: './expense-type-list.component.scss'
})
export class ExpenseTypeListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly ExpenseTypesFormEnum = ExpenseTypesFormEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: ExpenseTypeModel;
  protected selectedItems: ExpenseTypeModel[] = [];
  protected items: ExpenseTypeModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly expenseTypesHttpService: ExpenseTypesHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.EXPENSE_TYPES}]);
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
    this.expenseTypesHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: ExpenseTypesFormEnum.code},
      {field: 'name', header: ExpenseTypesFormEnum.name},
      {field: 'enabled', header: ExpenseTypesFormEnum.enabled},
      {field: 'sort', header: ExpenseTypesFormEnum.sort}
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

  validateButtonActions(item: ExpenseTypeModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.expenseTypesForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.expenseTypesForm(id)]);
  }

  disable(id: string) {
    this.expenseTypesHttpService.disable(id).subscribe(expenseType => {
      const index = this.items.findIndex(expenseType => expenseType.id === id);
      this.items[index] = expenseType;
    });
  }

  enable(id: string) {
    this.expenseTypesHttpService.enable(id).subscribe(expenseType => {
      const index = this.items.findIndex(expenseType => expenseType.id === id);
      this.items[index] = expenseType;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.expenseTypesHttpService.remove(id).subscribe((expenseType) => {
            this.items = this.items.filter(item => item.id !== expenseType.id);
          });
        }
      });
  }

  selectItem(item: ExpenseTypeModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
