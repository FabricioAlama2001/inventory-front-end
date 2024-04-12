import {Component, OnInit, inject} from '@angular/core';
import {Router} from '@angular/router';
import {TransactionModel} from '@models/core/transaction.model';
import {
  BreadcrumbService,
  CoreService,
  ExpensesHttpService,
  IncomesHttpService,
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
import {ColumnModel} from "@models/core";

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrl: './income-list.component.scss'
})
export class IncomeListComponent implements OnInit {
  /** Services **/
  private readonly incomesHttpService = inject(IncomesHttpService);
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
  protected items: TransactionModel[] = [];
  protected selectedIncomes!: TransactionModel;
  protected selectedIIncomes: TransactionModel[] = [];

  // protected search: FormControl = new FormControl('');//Busqueada cuando hay paginado en el backend
  protected globalFilterFields: string[] = ['code', 'name'];//Busqueda cuando hay paginado en el frontend

  constructor() {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.TRANSACTIONS}]);
  }

  ngOnInit() {
    // this.checkValueChanges();
    this.findIncomes();
  }

  findIncomes() {
    this.incomesHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
      });
  }

  // Para poner nombres y orden de las columnas de la tabla
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'authorizer', header: 'Autorización'},
      {field: 'dispatcher', header: 'Despachador'},
      {field: 'receiver', header: 'Proveedor/Cliente'},
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
          if (this.selectedIncomes?.id) this.redirectEditForm(this.selectedIncomes.id);
        },
      },
      {
        id: IdButtonActionEnum.DELETE,
        label: LabelButtonActionEnum.DELETE,
        icon: IconButtonActionEnum.DELETE,
        command: () => {
          if (this.selectedIncomes?.id) this.remove(this.selectedIncomes.id);
        },
      },
      {
        id: IdButtonActionEnum.DOWNLOADS,
        label: LabelButtonActionEnum.DOWNLOADS,
        icon: IconButtonActionEnum.DOWNLOADS,
        command: () => {
          if (this.selectedIncomes?.id) this.downloadIncomeReport(this.selectedIncomes.id);
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

  // Solo cambiar CategoryModel
  validateButtonActions(item: TransactionModel): void {
    this.buttonActions = this.buildButtonActions;

    // if (item.enabled) {
    //   this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    // }

    // if (!item.enabled) {
    //   this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    // }
  }

  // Solo cambiar la ruta del servicio
  redirectCreateForm(type: boolean) {
    localStorage.removeItem('transaction');

    let transactionStorage = null;

    if (type) {
      transactionStorage = {type: {name: 'Ingresos', type}};
    } else {
      transactionStorage = {type: {name: 'Egresos', type}};
    }

    localStorage.setItem('transaction', JSON.stringify(transactionStorage));

    this.router.navigate([this.routesService.transactionsForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    localStorage.removeItem('transaction');
    this.router.navigate([this.routesService.transactionsForm(id)]);
  }

  /** Actions **/
  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.incomesHttpService.remove(id).subscribe((removedItem) => {
            this.items = this.items.filter(item => item.id !== removedItem.id);
          });
        }
      });
  }

  // Solo cambiar CategoryModel
  selectItem(item: TransactionModel) {
    this.isButtonActions = true;
    this.selectedIncomes = item;
    this.validateButtonActions(item);
  }

  downloadIncomeReport(incomeId: string) {
    this.incomesHttpService.downloadReport(incomeId);
  }
}
