import {Component, inject, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {MenuItem, PrimeIcons} from "primeng/api";
import {ColumnModel, PaginatorModel, TransactionModel} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  RoutesService,
  TransactionsHttpService,
  UnitsHttpService
} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, TransactionsFormEnum, TableEnum, RoutesEnum
} from "@shared/enums";
import {AuthService} from "@services/auth";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly TableEnum = TableEnum;
  protected paginator: PaginatorModel;
  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;
  protected columns: ColumnModel[] = this.buildColumns;
  protected search: FormControl = new FormControl('');
  protected selectedItem!: TransactionModel;
  protected selectedItems: TransactionModel[] = [];
  protected items: TransactionModel[] = [];

  private readonly authService = inject(AuthService);
  private readonly unitsHttpService = inject(UnitsHttpService);

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly transactionsHttpService: TransactionsHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.TRANSACTIONS}]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findTransactionsByUser();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findTransactionsByUser();
    });
  }

  findTransactionsByUser(page: number = 0) {
    this.unitsHttpService.findTransactionsByUnit(this.authService.unit.id, this.authService.role.id)
      .subscribe((response) => {
        this.items = response;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: TransactionsFormEnum.code},
      {field: 'subject', header: TransactionsFormEnum.subject},
      {field: 'esigef', header: TransactionsFormEnum.esigef},
      {field: 'value', header: TransactionsFormEnum.value},
      {field: 'isIva', header: TransactionsFormEnum.isIva},
      {field: 'description', header: TransactionsFormEnum.description},
      {field: 'applicationStatus', header: TransactionsFormEnum.applicationStatus},
      {field: 'unit', header: TransactionsFormEnum.unit},
      {field: 'enabled', header: TransactionsFormEnum.enabled},
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

  validateButtonActions(item: TransactionModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.transactionsForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.transactionsForm(id)]);
  }

  disable(id: string) {
    this.transactionsHttpService.disable(id).subscribe(transaction => {
      const index = this.items.findIndex(transaction => transaction.id === id);
      this.items[index] = transaction;
    });
  }

  enable(id: string) {
    this.transactionsHttpService.enable(id).subscribe(transaction => {
      const index = this.items.findIndex(transaction => transaction.id === id);
      this.items[index] = transaction;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.transactionsHttpService.remove(id).subscribe((transaction) => {
            this.items = this.items.filter(item => item.id !== transaction.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findTransactionsByUser(event.page);
  }

  selectItem(item: TransactionModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
