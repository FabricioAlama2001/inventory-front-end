import {Component, OnInit, inject} from '@angular/core';
import {Router} from '@angular/router';
import {ExpenseModel} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  ExpensesHttpService,
  MessageService,
  RoutesService
} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum,
  RoutesEnum,
  TableEnum
} from '@shared/enums';
import {MenuItem,PrimeIcons} from "primeng/api";
import {ColumnModel, PaginatorModel} from "@models/core";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
  /** Services **/
  private readonly expensesHttpService = inject(ExpensesHttpService);
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
  protected items: ExpenseModel[] = [];
  protected selectedItem!: ExpenseModel;
  protected selectedIItems: ExpenseModel[] = [];

  protected paginator!: PaginatorModel;
  protected search: FormControl = new FormControl('');

  constructor() {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.TRANSACTIONS}]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findExpenses();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findExpenses();
    });
  }

  findExpenses(page: number = 0) {
    this.expensesHttpService.findExpenses(page,this.search.value)
      .subscribe((response) => {
        this.items = response.data;
        this.paginator = response.pagination!;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'authorizer', header: 'Autorización'},
      {field: 'dispatcher', header: 'Despachador'},
      {field: 'receiver', header: 'Proveedor'},
      {field: 'date', header: 'Fecha'}
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
        id: IdButtonActionEnum.DOWNLOADS,
        label: LabelButtonActionEnum.DOWNLOADS,
        icon: IconButtonActionEnum.DOWNLOADS,
        command: () => {
          if (this.selectedItem?.id) this.downloadIncomeReport(this.selectedItem.id);
        },
      },
      // {
      //   id: IdButtonActionEnum.DISABLE,
      //   label: LabelButtonActionEnum.DISABLE,
      //   icon: IconButtonActionEnum.DISABLE,
      //   command: () => {
      //     if (this.selectedItem?.id) this.disable(this.selectedItem.id);
      //   },
      // },
      // {
      //   id: IdButtonActionEnum.ENABLE,
      //   label: LabelButtonActionEnum.ENABLE,
      //   icon: IconButtonActionEnum.ENABLE,
      //   command: () => {
      //     if (this.selectedItem?.id) this.enable(this.selectedItem.id);
      //   },
      // },
    ];
  }

  validateButtonActions(item: ExpenseModel): void {
    this.buttonActions = this.buildButtonActions;

    // if (item.enabled) {
    //   this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    // }

    // if (!item.enabled) {
    //   this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    // }
  }

  redirectCreateForm() {
    localStorage.removeItem('transaction');

    let transactionStorage = null;

    transactionStorage = {type: {name: 'Egresos', type:false}};

    localStorage.setItem('transaction', JSON.stringify(transactionStorage));

    this.router.navigate([this.routesService.transactionsForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.transactionsForm(id)]);
  }

  /** Actions **/
  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.expensesHttpService.remove(id).subscribe((removedItem) => {
            this.items = this.items.filter(item => item.id !== removedItem.id);
          });
        }
      });
  }

  selectItem(item: ExpenseModel) {
    this.isButtonActions = true;
    this.selectedItem = item;

    localStorage.removeItem('transaction');

    let transactionStorage = null;

    transactionStorage = {type: {name: 'Egresos', type:false}};

    localStorage.setItem('transaction', JSON.stringify(transactionStorage));

    this.validateButtonActions(item);
  }

  downloadIncomeReport(incomeId: string) {
    this.expensesHttpService.downloadReport(incomeId);
  }

  paginate(event: any) {
    this.findExpenses(event.page);
  }
}
