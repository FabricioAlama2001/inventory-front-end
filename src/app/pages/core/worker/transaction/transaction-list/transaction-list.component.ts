import { Component, OnInit, inject } from '@angular/core';
import { TransactionsService } from '@services/core/transactions.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.transactionsService.findAll().subscribe((response) => {
      console.log(response);
    });
  }
}
