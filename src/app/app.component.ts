import {Component, Inject} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  SchoolPeriodsHttpService,
  SchoolPeriodsService
} from "@services/core";
import {BreadcrumbEnum, CoreMessageEnum} from "@shared/enums";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected readonly CoreMessageEnum = CoreMessageEnum;

  constructor(@Inject(DOCUMENT) private document: Document, private primengConfig: PrimeNGConfig,
              public readonly coreService: CoreService, private breadcrumbService: BreadcrumbService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.HOME}]);
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  switchTheme(theme: string) {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (theme)
      themeLink.href = `./assets/themes/${theme}/theme.css`;
  }
}
