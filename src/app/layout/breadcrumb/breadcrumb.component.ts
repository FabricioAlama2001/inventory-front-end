import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {BreadcrumbService, CoreService, RoutesService} from '@services/core';
import {AuthHttpService, AuthService} from "@services/auth";
import {environment} from "@env/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly HOST_URL: string = environment.HOST_URL;
  protected subscription: Subscription;
  protected items: MenuItem[] = [];
  protected home: MenuItem;
  protected nickname: string;

  protected readonly breadcrumbService = inject(BreadcrumbService);
  protected readonly coreService = inject(CoreService);
  private readonly authHttpService = inject(AuthHttpService);
  protected readonly authService = inject(AuthService);
  private readonly routesService = inject(RoutesService);
  private readonly router = inject(Router);

  constructor() {
    if (this.authService.fiscalYear) {
      this.nickname = `${this.authService.auth.identification} - ${this.authService.role.name} - ${this.authService.fiscalYear.year}`;
    } else {
      this.nickname = `${this.authService.auth.identification} - ${this.authService.role.name}`;
    }

    this.subscription = this.breadcrumbService.itemsHandler.subscribe(response => {
      this.items = response as MenuItem[];
    });

    this.home = {icon: PrimeIcons.HOME, routerLink: `/core/dashboards/${this.authService.role?.code}`};
  }


  redirectProfile() {
    this.router.navigate([this.routesService.profile]);
  }

  signOut() {
    this.authHttpService.signOut();
  }

  updateSystem() {
    this.coreService.updateSystem();
  }
}
