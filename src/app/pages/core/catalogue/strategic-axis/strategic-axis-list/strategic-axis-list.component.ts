import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {StrategicAxisModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, RoutesService, StrategicAxesHttpService} from '@services/core';
import {
  BreadcrumbEnum,
  StrategicAxesFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";


@Component({
  selector: 'app-strategic-axis-list',
  templateUrl: './strategic-axis-list.component.html',
  styleUrl: './strategic-axis-list.component.scss'
})
export class StrategicAxisListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly StrategicAxesFormEnum = StrategicAxesFormEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: StrategicAxisModel;
  protected selectedItems: StrategicAxisModel[] = [];
  protected items: StrategicAxisModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly strategicAxesHttpService: StrategicAxesHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.STRATEGIC_AXES}]);
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
    this.strategicAxesHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'institutionalStrategicPlan', header: StrategicAxesFormEnum.institutionalStrategicPlan},
      {field: 'code', header: StrategicAxesFormEnum.code},
      {field: 'name', header: StrategicAxesFormEnum.name},
      {field: 'enabled', header: StrategicAxesFormEnum.enabled},
      {field: 'sort', header: StrategicAxesFormEnum.sort}
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

  validateButtonActions(item: StrategicAxisModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.strategicAxesForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.strategicAxesForm(id)]);
  }

  disable(id: string) {
    this.strategicAxesHttpService.disable(id).subscribe(strategicAxis => {
      const index = this.items.findIndex(strategicAxis => strategicAxis.id === id);
      this.items[index] = strategicAxis;
    });
  }

  enable(id: string) {
    this.strategicAxesHttpService.enable(id).subscribe(strategicAxis => {
      const index = this.items.findIndex(strategicAxis => strategicAxis.id === id);
      this.items[index] = strategicAxis;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.strategicAxesHttpService.remove(id).subscribe((strategicAxis) => {
            this.items = this.items.filter(item => item.id !== strategicAxis.id);
          });
        }
      });
  }

  selectItem(item: StrategicAxisModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
