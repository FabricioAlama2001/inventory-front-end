import { ProductsService } from './../../../../../services/core/products.service';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.productsService.findAll().subscribe((response) => {
      console.log(response);
    });
  }

}
