import {Component, inject} from '@angular/core';
import {BreadcrumbService, RoutesService} from "@services/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.scss']
})
export class WorkerComponent {
  protected catalogueMenus: any = [];
  protected transactionMenus: any = [];
  protected reportMenus: any = [];
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly router = inject(Router);
  private readonly routesService = inject(RoutesService);


  constructor() {
    this.breadcrumbService.setItems([{label: 'Dashboard'}]);

    this.loadMenus();
  }

  loadMenus() {
    const assetsPath = 'assets/images/components/dashboards/worker';

    this.transactionMenus.push(
      {
        code: 'transactions',
        header: 'Ingresos y Egresos',
        subheader: 'Transacciones',
        img: `${assetsPath}/transaction.png`,
        routerLink: this.routesService.transactionsList,
      },
      {
        code: 'categories',
        header: 'Categorías',
        subheader: 'Administrar',
        img: `${assetsPath}/category.png`,
        routerLink: this.routesService.categoriesList,
      },
      {
        code: 'products',
        header: 'Products',
        subheader: 'Administrar',
        img: `${assetsPath}/product.png`,
        routerLink: this.routesService.productsList,
      },
    );
  }

  redirect(url: string) {
    this.router.navigate([url]);
  }
}
