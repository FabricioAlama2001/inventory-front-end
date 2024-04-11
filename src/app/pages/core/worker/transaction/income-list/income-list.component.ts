import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionModel } from '@models/core/transaction.model';
import { BreadcrumbService, CoreService, IncomesHttpService, MessageService, RoutesService } from '@services/core';
import { BreadcrumbEnum, ClassButtonActionEnum, IconButtonActionEnum, IdButtonActionEnum, LabelButtonActionEnum, TableEnum } from '@shared/enums';
import { PrimeIcons } from 'primeng/api/primeicons';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrl: './income-list.component.scss'
})
export class IncomeListComponent implements OnInit {

  private readonly incomesHttpService = inject(IncomesHttpService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly router = inject(Router);
  private readonly routesService = inject(RoutesService);
  protected readonly coreService = inject(CoreService);
  protected readonly messageService = inject(MessageService);

  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly IdButtonActionEnum = IdButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly TableEnum = TableEnum;
  
  protected incomes: TransactionModel[] = [];
  protected selectedIncomes!: TransactionModel;
  protected selectedIIncomes: TransactionModel[] = [];


  constructor() {
    this.breadcrumbService.setItems([{ label: BreadcrumbEnum.TRANSACTIONS }]);
  }

  ngOnInit() {
    // this.checkValueChanges();
    this.findIncomes();
  }

  findIncomes() {
    this.incomesHttpService.findAll()
      .subscribe((response) => {
        this.incomes = response;
      });
  }

}
