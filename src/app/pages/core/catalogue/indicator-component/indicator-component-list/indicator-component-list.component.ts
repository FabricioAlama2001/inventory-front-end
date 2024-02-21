import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {IndicatorComponentModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, RoutesService, IndicatorComponentsHttpService} from '@services/core';
import {
  BreadcrumbEnum,
  IndicatorComponentsFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";


@Component({
  selector: 'app-indicator-component-list',
  templateUrl: './indicator-component-list.component.html',
  styleUrl: './indicator-component-list.component.scss'
})
export class IndicatorComponentListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly IndicatorComponentsFormEnum = IndicatorComponentsFormEnum;
  protected readonly IdButtonActionEnum = IdButtonActionEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: IndicatorComponentModel;
  protected selectedItems: IndicatorComponentModel[] = [];
  protected items: IndicatorComponentModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly indicatorComponentsHttpService: IndicatorComponentsHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.INDICATOR_COMPONENTS}]);
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findAll();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findAll();
    });
  }

  findAll() {
    this.indicatorComponentsHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: IndicatorComponentsFormEnum.code},
      {field: 'name', header: IndicatorComponentsFormEnum.name},
      {field: 'sort', header: IndicatorComponentsFormEnum.sort},
      {field: 'enabled', header: IndicatorComponentsFormEnum.enabled}
    ];
  }

  get buildButtonActions(): MenuItem[] {
    return [
      {
        id: IdButtonActionEnum.UPDATE,
        label: LabelButtonActionEnum.UPDATE,
        icon: IconButtonActionEnum.UPDATE,
        command: () => {
          if (this.selectedItem?.id) this.redirectEditForm(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.DELETE,
        label: LabelButtonActionEnum.DELETE,
        icon: IconButtonActionEnum.DELETE,
        command: () => {
          if (this.selectedItem?.id) this.remove(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.DISABLE,
        label: LabelButtonActionEnum.DISABLE,
        icon: IconButtonActionEnum.DISABLE,
        command: () => {
          if (this.selectedItem?.id) this.disable(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.ENABLE,
        label: LabelButtonActionEnum.ENABLE,
        icon: IconButtonActionEnum.ENABLE,
        command: () => {
          if (this.selectedItem?.id) this.enable(this.selectedItem.id);
        },
      },
    ];
  }

  validateButtonActions(item: IndicatorComponentModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.indicatorComponentsForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.indicatorComponentsForm(id)]);
  }

  disable(id: string) {
    this.indicatorComponentsHttpService.disable(id).subscribe(indicatorComponent => {
      const index = this.items.findIndex(indicatorComponent => indicatorComponent.id === id);
      this.items[index] = indicatorComponent;
    });
  }

  enable(id: string) {
    this.indicatorComponentsHttpService.enable(id).subscribe(indicatorComponent => {
      const index = this.items.findIndex(indicatorComponent => indicatorComponent.id === id);
      this.items[index] = indicatorComponent;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.indicatorComponentsHttpService.remove(id).subscribe((indicatorComponent) => {
            this.items = this.items.filter(item => item.id !== indicatorComponent.id);
          });
        }
      });
  }

  selectItem(item: IndicatorComponentModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
