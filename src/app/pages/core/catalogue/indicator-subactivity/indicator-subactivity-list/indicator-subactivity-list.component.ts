import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {IndicatorSubactivityModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, RoutesService, IndicatorSubactivitiesHttpService} from '@services/core';
import {
  BreadcrumbEnum,
  IndicatorSubactivitiesFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";

@Component({
  selector: 'app-indicator-subactivity-list',
  templateUrl: './indicator-subactivity-list.component.html',
  styleUrl: './indicator-subactivity-list.component.scss'
})
export class IndicatorSubactivityListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly IndicatorSubactivitiesFormEnum = IndicatorSubactivitiesFormEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: IndicatorSubactivityModel;
  protected selectedItems: IndicatorSubactivityModel[] = [];
  protected items: IndicatorSubactivityModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly indicatorSubactivitiesHttpService: IndicatorSubactivitiesHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.INDICATOR_SUBACTIVITIES}]);
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
    this.indicatorSubactivitiesHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: IndicatorSubactivitiesFormEnum.code},
      {field: 'name', header: IndicatorSubactivitiesFormEnum.name},
      {field: 'enabled', header: IndicatorSubactivitiesFormEnum.enabled},
      {field: 'sort', header: IndicatorSubactivitiesFormEnum.sort}
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

  validateButtonActions(item: IndicatorSubactivityModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.indicatorSubactivitiesForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.indicatorSubactivitiesForm(id)]);
  }

  disable(id: string) {
    this.indicatorSubactivitiesHttpService.disable(id).subscribe(indicator => {
      const index = this.items.findIndex(indicator => indicator.id === id);
      this.items[index] = indicator;
    });
  }

  enable(id: string) {
    this.indicatorSubactivitiesHttpService.enable(id).subscribe(indicator => {
      const index = this.items.findIndex(indicator => indicator.id === id);
      this.items[index] = indicator;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.indicatorSubactivitiesHttpService.remove(id).subscribe((indicator) => {
            this.items = this.items.filter(item => item.id !== indicator.id);
          });
        }
      });
  }

  selectItem(item: IndicatorSubactivityModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
