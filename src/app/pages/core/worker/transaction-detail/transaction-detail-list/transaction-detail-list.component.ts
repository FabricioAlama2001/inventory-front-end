import {Component, OnInit, inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ColumnModel} from '@models/core';
import {TransactionDetailModel} from '@models/core/transaction-detail.model';
import {BreadcrumbService, CoreService, MessageService, RoutesService} from '@services/core';
import {TransactionDetailsHttpService} from '@services/core/transaction-details-http.service';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum,
  RoutesEnum,
  TableEnum
} from '@shared/enums';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {iterator} from "rxjs/internal/symbol/iterator";
import {IncomeModel} from "@models/core/income.model";

@Component({
  selector: 'app-transaction-detail-list',
  templateUrl: './transaction-detail-list.component.html',
  styleUrl: './transaction-detail-list.component.scss'
})
export class TransactionDetailListComponent implements OnInit {
  /** Services **/
  private readonly transactionDetailsHttpService = inject(TransactionDetailsHttpService);
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
  // protected globalFilterFields: string[] = ['code', 'name'];//Busqueda cuando hay paginado en el frontend
  @Input() items: TransactionDetailModel[] = [];
  @Input() title!: string;
  @Input() isIncome: boolean = false;
  protected selectedItem!: TransactionDetailModel;
  protected selectedItems: TransactionDetailModel[] = [];
  protected isTransactionForm: boolean = false;

  constructor() {

  }

  ngOnInit() {

  }

  // Para poner nombres y orden de las columnas de la tabla
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'quantity', header: 'Cantidad'},
      {field: 'code', header: 'Código'},
      {field: 'product', header: 'Producto'},
      {field: 'observation', header: 'Observación'},
    ];
  }

  validateButtonActions(item: TransactionDetailModel): void {
    this.buttonActions = this.buildButtonActions;

  }

  get buildButtonActions(): MenuItem[] {
    return [
      {
        id: IdButtonActionEnum.UPDATE,
        label: LabelButtonActionEnum.UPDATE,
        icon: IconButtonActionEnum.UPDATE,
        command: () => {
          this.openTransactionForm();
        },
      },
      {
        id: IdButtonActionEnum.DELETE,
        label: LabelButtonActionEnum.DELETE,
        icon: IconButtonActionEnum.DELETE,
        command: () => {
          if (this.selectedItem?.product) this.remove(this.selectedItem.product.id);
        },
      },
    ];
  }

  // Solo cambiar categoriesHttpService
  remove(productId: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.items = this.items.filter(item => item.product.id !== productId);
          const transactionStorage = JSON.parse(localStorage.getItem('transaction')!) as IncomeModel;

          if (transactionStorage) {
            transactionStorage.transactionDetails = this.items;

            localStorage.setItem('transaction', JSON.stringify(transactionStorage));
          }
        }
      });
  }

  // Solo cambiar CategoryModel
  selectItem(item: TransactionDetailModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }

  openTransactionForm() {
    this.isTransactionForm = true;
  }

  editTransactionDetail(transactionDetailModel: TransactionDetailModel) {
    const index = this.items.findIndex(item => item.product.id == transactionDetailModel.product.id);
    this.items[index] = transactionDetailModel;
    this.isTransactionForm = false;
    this.messageService.successCustom('Producto Actualizado', 'Correctamente');

    const transactionStorage = JSON.parse(localStorage.getItem('transaction')!) as IncomeModel;

    if (transactionStorage) {
      transactionStorage.transactionDetails = this.items;

      localStorage.setItem('transaction', JSON.stringify(transactionStorage));
    }
  }
}
