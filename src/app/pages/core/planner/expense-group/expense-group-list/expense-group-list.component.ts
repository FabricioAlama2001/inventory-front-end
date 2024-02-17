import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {BudgetItemModel, ColumnModel, ExpenseGroupModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, RoutesService, ExpenseGroupsHttpService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  ExpenseGroupsFormEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum
} from "@shared/enums";
@Component({
  selector: 'app-expense-group-list',
  templateUrl: './expense-group-list.component.html',
  styleUrl: './expense-group-list.component.scss'
})
export class ExpenseGroupListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: ExpenseGroupModel;
  protected selectedItems: ExpenseGroupModel[] = [];
  protected items: ExpenseGroupModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly expenseGroupsHttpService: ExpenseGroupsHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.EXPENSE_GROUP}]);
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findExpenseGroups();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findExpenseGroups();
    });
  }

  findExpenseGroups(page: number = 0) {
    this.expenseGroupsHttpService.findExpenseGroups(page, this.search.value)
      .subscribe((response) => {
        this.items = response;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: 'Codigo'},
      {field: 'name', header: 'Nombre'},
      {field: 'enabled', header: ExpenseGroupsFormEnum.enabled},
      {field: 'sort', header: 'Orden'}
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

  validateButtonActions(item: ExpenseGroupModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.expenseGroupForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.expenseGroupForm(id)]);
  }

  disable(id: string) {
    this.expenseGroupsHttpService.disable(id).subscribe(expenseGroup => {
      const index = this.items.findIndex(expenseGroup => expenseGroup.id === id);
      this.items[index] = expenseGroup;
    });
  }

  enable(id: string) {
    this.expenseGroupsHttpService.enable(id).subscribe(expenseGroup => {
      const index = this.items.findIndex(expenseGroup => expenseGroup.id === id);
      this.items[index] = expenseGroup;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.expenseGroupsHttpService.remove(id).subscribe((expenseGroup) => {
            this.items = this.items.filter(item => item.id !== expenseGroup.id);
          });
        }
      });
  }

  selectItem(item: ExpenseGroupModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
