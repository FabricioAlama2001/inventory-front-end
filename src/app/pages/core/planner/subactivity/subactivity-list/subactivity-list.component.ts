import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ColumnModel, PaginatorModel, SubactivityModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, SubactivitiesHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, SubactivitiesFormEnum, RoutesEnum, TableEnum
} from "@shared/enums";

@Component({
  selector: 'app-subactivity-list',
  templateUrl: './subactivity-list.component.html',
  styleUrl: './subactivity-list.component.scss'
})
export class SubactivityListComponent {
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

  protected selectedItem!: SubactivityModel;
  protected selectedItems: SubactivityModel[] = [];
  protected items: SubactivityModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly subactivitiesHttpService: SubactivitiesHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.SUBACTIVITIES}]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findSubactivities();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findSubactivities();
    });
  }

  findSubactivities(page: number = 0) {
    this.subactivitiesHttpService.findSubactivities(page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'fiscalYear', header: SubactivitiesFormEnum.fiscalYear},
      {field: 'indicatorSubactivity', header: SubactivitiesFormEnum.indicatorSubactivity},
      //{field: 'institutionalStrategicPlan', header: SubactivitiesFormEnum.institutionalStrategicPlan},
      {field: 'strategicAxis', header: SubactivitiesFormEnum.strategicAxis},
      {field: 'strategy', header: SubactivitiesFormEnum.strategy},
      //{field: 'continent', header: SubactivitiesFormEnum.continent},
      //{field: 'country', header: SubactivitiesFormEnum.country},
      //{field: 'province', header: SubactivitiesFormEnum.province},
      //{field: 'canton', header: SubactivitiesFormEnum.canton},
      //{field: 'parish', header: SubactivitiesFormEnum.parish},
      {field: 'poa', header: SubactivitiesFormEnum.poa},
      {field: 'unit', header: SubactivitiesFormEnum.unit},
      {field: 'name', header: SubactivitiesFormEnum.name},
      //{field: 'type', header: SubactivitiesFormEnum.type},
      {field: 'enabled', header: SubactivitiesFormEnum.enabled},
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

  validateButtonActions(item: SubactivityModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.subactivitiesForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.subactivitiesForm(id)]);
  }

  disable(id: string) {
    this.subactivitiesHttpService.disable(id).subscribe(subactivity => {
      const index = this.items.findIndex(subactivity => subactivity.id === id);
      this.items[index] = subactivity;
    });
  }

  enable(id: string) {
    this.subactivitiesHttpService.enable(id).subscribe(subactivity => {
      const index = this.items.findIndex(subactivity => subactivity.id === id);
      this.items[index] = subactivity;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.subactivitiesHttpService.remove(id).subscribe((subactivity) => {
            this.items = this.items.filter(item => item.id !== subactivity.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findSubactivities(event.page);
  }

  selectItem(item: SubactivityModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
