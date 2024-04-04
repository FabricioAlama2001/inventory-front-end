import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnModel } from '@models/core';
import { TransactionDetailModel } from '@models/core/transaction-detail.model';
import { BreadcrumbService, CoreService, MessageService, RoutesService } from '@services/core';
import { TransactionDetailsHttpService } from '@services/core/transaction-details-http.service';
import { BreadcrumbEnum, ClassButtonActionEnum, IconButtonActionEnum, IdButtonActionEnum, LabelButtonActionEnum, RoutesEnum, TableEnum } from '@shared/enums';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-transaction-detail-list',
  templateUrl: './transaction-detail-list.component.html',
  styleUrl: './transaction-detail-list.component.scss'
})
export class TransactionDetailListComponent implements OnInit  {
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
  protected items: TransactionDetailModel[] = [];
  protected selectedItem!: TransactionDetailModel;
  protected selectedItems: TransactionDetailModel[] = [];
  
  constructor() {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.APPLICATION_STATUS}]);
  }

  
  ngOnInit() {
  
    this.findAll();
  }

  checkValueChanges() {  }
  findAll() {
    this.transactionDetailsHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
      });
  }


  
  
  // Para poner nombres y orden de las columnas de la tabla
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'quantity', header: 'Cantidad'},
      {field: 'observation', header: 'Detalle'},
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
    ];
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.transactionDetailsForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.transactionDetailsForm(id)]);
  }
  // Solo cambiar categoriesHttpService
  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.transactionDetailsHttpService.remove(id).subscribe((removedItem) => {
            this.items = this.items.filter(item => item.id !== removedItem.id);
          });
        }
      });
  }
    // Solo cambiar CategoryModel
    selectItem(item: TransactionDetailModel) {
      this.isButtonActions = true;
      this.selectedItem = item;
      this.validateButtonActions(item);
    }

}
