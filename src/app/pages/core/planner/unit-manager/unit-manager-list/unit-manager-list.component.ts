import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ColumnModel, PaginatorModel, UnitManagerModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, UnitManagersHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, UnitManagersFormEnum, RoutesEnum, TableEnum
} from "@shared/enums";

@Component({
  selector: 'app-unit-manager-list',
  templateUrl: './unit-manager-list.component.html',
  styleUrl: './unit-manager-list.component.scss'
})
export class UnitManagerListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly TableEnum = TableEnum;

  protected paginator: PaginatorModel;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: UnitManagerModel;
  protected selectedItems: UnitManagerModel[] = [];
  protected items: UnitManagerModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly unitManagersHttpService: UnitManagersHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.UNIT_MANAGERS}]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findUnitManagers();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findUnitManagers();
    });
  }

  findUnitManagers(page: number = 0) {
    this.unitManagersHttpService.findUnitManagers(page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'user', header: UnitManagersFormEnum.user},
      {field: 'role', header: UnitManagersFormEnum.role},
      {field: 'unit', header: UnitManagersFormEnum.unit},
      {field: 'code', header: UnitManagersFormEnum.code},
      {field: 'date', header: UnitManagersFormEnum.date},
      {field: 'enabled', header: UnitManagersFormEnum.enabled},
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

  validateButtonActions(item: UnitManagerModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.unitManagersForm(RoutesEnum.NEW)]);
  }


  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.unitManagersForm(id)]);
  }

  disable(id: string) {
    this.unitManagersHttpService.disable(id).subscribe(unitManager => {
      const index = this.items.findIndex(unitManager => unitManager.id === id);
      this.items[index] = unitManager;
    });
  }

  enable(id: string) {
    this.unitManagersHttpService.enable(id).subscribe(unitManager => {
      const index = this.items.findIndex(unitManager => unitManager.id === id);
      this.items[index] = unitManager;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.unitManagersHttpService.remove(id).subscribe((unitManager) => {
            this.items = this.items.filter(item => item.id !== unitManager.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findUnitManagers(event.page);
  }

  selectItem(item: UnitManagerModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
