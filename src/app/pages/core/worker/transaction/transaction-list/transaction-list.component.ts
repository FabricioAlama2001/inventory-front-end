import { Component, OnInit, inject } from '@angular/core';
import { Router } from "@angular/router";
import {
  BreadcrumbService,
  CoreService,
  ExpensesHttpService,
  IncomesHttpService,
  MessageService,
  RoutesService
} from '@services/core';

import { MenuItem, PrimeIcons } from "primeng/api";
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import { ColumnModel } from "@models/core";
import { IncomeModel } from '@models/core/income.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent implements OnInit {
  ngOnInit(): void {
  }
 }
