import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionModel } from '@models/core/transaction.model';
import { BreadcrumbService, CoreService, ExpensesHttpService, MessageService, RoutesService } from '@services/core';
import { BreadcrumbEnum, ClassButtonActionEnum, IconButtonActionEnum, IdButtonActionEnum, LabelButtonActionEnum, TableEnum } from '@shared/enums';
import { PrimeIcons } from 'primeng/api/primeicons';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {

  private readonly expensesHttpService = inject(ExpensesHttpService);
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
  
  protected expenses: TransactionModel[] = [];
  protected selectedExpensesItem!: TransactionModel;
  protected selectedExpenses: TransactionModel[] = [];
  // protected search: FormControl = new FormControl('')
  constructor() {
    this.breadcrumbService.setItems([{ label: BreadcrumbEnum.TRANSACTIONS }]);
  }
  ngOnInit() {
    // this.checkValueChanges();
    this.findExpenses();
  }

  
  findExpenses() {
    this.expensesHttpService.findAll()
      .subscribe((response) => {
        this.expenses = response;
      });
  }

}
