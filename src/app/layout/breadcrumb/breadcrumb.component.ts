import {Component, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {BreadcrumbService, CoreService, InstitutionsService, RoutesService} from '@services/core';
import {AuthHttpService, AuthService} from "@services/auth";
import {environment} from "@env/environment";

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

  constructor(public breadcrumbService: BreadcrumbService,
              public coreService: CoreService,
              private authHttpService: AuthHttpService,
              protected authService: AuthService,
              protected institutionsService: InstitutionsService,
              private routesService: RoutesService) {
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
      this.items = response as MenuItem[];
    });

    this.home = {icon: PrimeIcons.HOME, routerLink: `/core/dashboards/${authService.role?.code}`};
  }


  redirectProfile() {
    this.routesService.profile();
  }

  signOut() {
    this.authHttpService.signOut();
  }

  updateSystem(){
    this.coreService.updateSystem();
  }
}
