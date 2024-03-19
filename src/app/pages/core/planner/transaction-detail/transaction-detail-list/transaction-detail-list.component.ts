import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ColumnModel, PaginatorModel, TransactionDetailModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, RoutesService, TransactionDetailsHttpService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, TransactionDetailsFormEnum, TableEnum, RoutesEnum
} from "@shared/enums";

@Component({
  selector: 'app-transaction-detail-list',
  templateUrl: './transaction-detail-list.component.html',
  styleUrl: './transaction-detail-list.component.scss'
})
export class TransactionDetailListComponent {
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

  protected selectedItem!: TransactionDetailModel;
  protected selectedItems: TransactionDetailModel[] = [];
  protected items: TransactionDetailModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly transactionDetailsHttpService: TransactionDetailsHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.TRANSACTION_DETAILS}]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findTransactionDetails();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findTransactionDetails();
    });
  }

  findTransactionDetails(page: number = 0) {
    this.transactionDetailsHttpService.findTransactionDetails(page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'amount', header: TransactionDetailsFormEnum.amount},
      {field: 'advance', header: TransactionDetailsFormEnum.advance},
      {field: 'cur', header: TransactionDetailsFormEnum.cur},
      {field: 'goal', header: TransactionDetailsFormEnum.goal},
      {field: 'date', header: TransactionDetailsFormEnum.date},
      {field: 'isIva', header: TransactionDetailsFormEnum.isIva},
      {field: 'enabled', header: TransactionDetailsFormEnum.enabled},
      {field: 'state', header: TransactionDetailsFormEnum.state},
      {field: 'process', header: TransactionDetailsFormEnum.process},
      {field: 'unit', header: TransactionDetailsFormEnum.unit},
      {field: 'principalUnit', header: TransactionDetailsFormEnum.principalUnit},
      {field: 'documentType', header: TransactionDetailsFormEnum.documentType},
      {field: 'transaction', header: TransactionDetailsFormEnum.transaction},
      {field: 'subactivity', header: TransactionDetailsFormEnum.subactivity},
      {field: 'programmingType', header: TransactionDetailsFormEnum.programmingType},

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

  validateButtonActions(item: TransactionDetailModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.transactionDetailsForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.transactionDetailsForm(id)]);
  }

  disable(id: string) {
    this.transactionDetailsHttpService.disable(id).subscribe(transaction => {
      const index = this.items.findIndex(transaction => transaction.id === id);
      this.items[index] = transaction;
    });
  }

  enable(id: string) {
    this.transactionDetailsHttpService.enable(id).subscribe(transaction => {
      const index = this.items.findIndex(transaction => transaction.id === id);
      this.items[index] = transaction;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.transactionDetailsHttpService.remove(id).subscribe((transaction) => {
            this.items = this.items.filter(item => item.id !== transaction.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findTransactionDetails(event.page);
  }

  selectItem(item: TransactionDetailModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
