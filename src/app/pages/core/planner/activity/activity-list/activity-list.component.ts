import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ColumnModel, PaginatorModel, ActivityModel, ComponentModel} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  ComponentsHttpService,
  RoutesService,
  ActivitiesHttpService
} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, ActivitiesFormEnum, RoutesEnum, TableEnum
} from "@shared/enums";


@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss'
})
export class ActivityListComponent {
  @Input({alias: 'id'}) componentId: string = '';

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

  protected selectedItem!: ActivityModel;
  protected selectedItems: ActivityModel[] = [];
  protected items: ActivityModel[] = [];

  protected components: ComponentModel[] = [];
  protected component: FormControl = new FormControl(null);

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly activitiesHttpService: ActivitiesHttpService,
    private readonly componentsHttpService: ComponentsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.ACTIVITIES, routerLink: [this.routesService.activitiesList]},
      {label: BreadcrumbEnum.ACTIVITIES}
    ]);

    console.log('asd');
    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.loadComponents();

    this.checkValueChanges();
    if (this.componentId) {
      this.findActivitiesByComponent();
    }
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findActivitiesByComponent();
    });

    this.component.valueChanges.subscribe(value => {
      if (value) {
        this.componentId = value.id;
        this.findActivitiesByComponent();
      }
    });
  }

  findActivitiesByComponent(page: number = 0) {
    this.componentsHttpService.findActivitiesByComponent(this.componentId, page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: ActivitiesFormEnum.code},
      {field: 'name', header: ActivitiesFormEnum.name},
      {field: 'component', header: ActivitiesFormEnum.component},
      {field: 'fiscalYear', header: ActivitiesFormEnum.fiscalYear},
      {field: 'enabled', header: ActivitiesFormEnum.enabled},
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

  validateButtonActions(item: ActivityModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  loadComponents(): void {
    this.componentsHttpService.findCatalogues().subscribe((components) => {
      this.components = components;
      this.component.patchValue(this.components.find(item => item.id === this.componentId));
    });
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.activitiesForm(this.componentId, RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.activitiesForm(this.componentId, id)]);
  }

  disable(id: string) {
    this.activitiesHttpService.disable(id).subscribe(activity => {
      const index = this.items.findIndex(activity => activity.id === id);
      this.items[index] = activity;
    });
  }

  enable(id: string) {
    this.activitiesHttpService.enable(id).subscribe(activity => {
      const index = this.items.findIndex(activity => activity.id === id);
      this.items[index] = activity;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.activitiesHttpService.remove(id).subscribe((activity) => {
            this.items = this.items.filter(item => item.id !== activity.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findActivitiesByComponent(event.page);
  }

  selectItem(item: ActivityModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
