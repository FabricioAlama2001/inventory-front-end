import {Component, inject} from '@angular/core';
import {BreadcrumbService, RoutesService} from "@services/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrl: './applicant.component.scss'
})
export class ApplicantComponent {
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
    const assetsPath = 'assets/images/components/dashboards/applicant';

    this.transactionMenus.push(
      {
        code: 'scp',
        header: 'Solicitar Certificación Presupuestaria',
        subheader: 'SCP',
        img: `${assetsPath}/scp.png`,
        routerLink: this.routesService.scpListApplicant,
      },
      {
        code: 'reform',
        header: 'Reforma / Reprogramación',
        subheader: 'Reformas y Reprogramaciones',
        img: `${assetsPath}/reform.png`,
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
