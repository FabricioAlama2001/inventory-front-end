import {Component, inject} from '@angular/core';
import {BreadcrumbService, RoutesService} from "@services/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent {
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
    const assetsPath = 'assets/images/components/dashboards/planner';

    this.catalogueMenus.push(
      {
        code: 'projects',
        header: 'Proyectos',
        subheader: 'Proyectos',
        img: `${assetsPath}/project.png`,
        routerLink: this.routesService.projectsList,
      },
      {
        code: 'components',
        header: 'Componentes',
        subheader: 'Componentes',
        img: `${assetsPath}/component.png`,
        routerLink: this.routesService.componentsList(),
      },
      {
        code: 'activities',
        header: 'Actividades',
        subheader: 'Actividades',
        img: `${assetsPath}/activity.png`,
        routerLink: this.routesService.activitiesList(),
      },
    );

    this.transactionMenus.push(
      {
        code: 'subactivities',
        header: 'Subactividades',
        subheader: 'Subactividades',
        img: `${assetsPath}/subactivity.png`,
        routerLink: this.routesService.subactivitiesList,
      },
      {
        code: 'scp',
        header: 'Solicitar Certificación Presupuestaria',
        subheader: 'SCP',
        img: `${assetsPath}/scp.png`,
        routerLink: '',
      },
      {
        code: 'reforma',
        header: 'Reforma / Reprogramación',
        subheader: 'SCP',
        img: `${assetsPath}/reforma.png`,
        routerLink: '',
      }
    );

    this.reportMenus.push(
      {
        code: 'subactivities',
        header: 'Subactividades',
        subheader: 'Subactividades',
        img: `${assetsPath}/subactivity.png`,
        routerLink: '',
      },
      {
        code: 'scp',
        header: 'Solicitar Certificación Presupuestaria',
        subheader: 'SCP',
        img: `${assetsPath}/scp.png`,
        routerLink: '',
      },
    );
  }

  redirect(url: string) {
    this.router.navigate([url]);
  }
}
