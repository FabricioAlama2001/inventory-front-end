import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {BudgetItemModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, BudgetItemsHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  BudgetItemsFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";


@Component({
  selector: 'app-budget-item-list',
  templateUrl: './budget-item-list.component.html',
  styleUrl: './budget-item-list.component.scss'
})
export class BudgetItemListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly BudgetItemsFormEnum = BudgetItemsFormEnum;
  protected readonly IdButtonActionEnum = IdButtonActionEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: BudgetItemModel;
  protected selectedItems: BudgetItemModel[] = [];
  protected items: BudgetItemModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly budgetItemsHttpService: BudgetItemsHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.BUDGET_ITEMS}]);
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
    this.budgetItemsHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'expenseGroup', header: BudgetItemsFormEnum.expenseGroup},
      {field: 'code', header: BudgetItemsFormEnum.code},
      {field: 'name', header: BudgetItemsFormEnum.name},
      {field: 'sort', header: BudgetItemsFormEnum.sort},
      {field: 'enabled', header: BudgetItemsFormEnum.enabled}
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

  validateButtonActions(item: BudgetItemModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.budgetItemsForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.budgetItemsForm(id)]);
  }

  disable(id: string) {
    this.budgetItemsHttpService.disable(id).subscribe(budgetItem => {
      const index = this.items.findIndex(budgetItem => budgetItem.id === id);
      this.items[index] = budgetItem;
    });
  }

  enable(id: string) {
    this.budgetItemsHttpService.enable(id).subscribe(budgetItem => {
      const index = this.items.findIndex(budgetItem => budgetItem.id === id);
      this.items[index] = budgetItem;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.budgetItemsHttpService.remove(id).subscribe((budgetItem) => {
            this.items = this.items.filter(item => item.id !== budgetItem.id);
          });
        }
      });
  }

  selectItem(item: BudgetItemModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
