import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ColumnModel, PaginatorModel, ComponentModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, ComponentsHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, ComponentsFormEnum, RoutesEnum, TableEnum
} from "@shared/enums";

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrl: './component-list.component.scss'
})
export class ComponentListComponent {
  @Input({alias: 'id'}) projectId: string = '';
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

  protected selectedItem!: ComponentModel;
  protected selectedItems: ComponentModel[] = [];
  protected items: ComponentModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly componentsHttpService: ComponentsHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.COMPONENTS}]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findComponents();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findComponents();
    });
  }

  findComponents(page: number = 0) {
    this.componentsHttpService.findComponents(page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'indicatorComponent', header: ComponentsFormEnum.indicatorComponent},
      {field: 'project', header: ComponentsFormEnum.project},
      {field: 'code', header: ComponentsFormEnum.code},
      {field: 'name', header: ComponentsFormEnum.name},
      {field: 'fiscalYear', header: ComponentsFormEnum.fiscalYear},
      {field: 'enabled', header: ComponentsFormEnum.enabled},
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

  validateButtonActions(item: ComponentModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.componentsForm(RoutesEnum.NEW)]);
  }

  redirectComponentsList(id:string) {
    this.router.navigate([this.routesService.components(id)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.componentsForm(id)]);
  }

  disable(id: string) {
    this.componentsHttpService.disable(id).subscribe(project => {
      const index = this.items.findIndex(project => project.id === id);
      this.items[index] = project;
    });
  }

  enable(id: string) {
    this.componentsHttpService.enable(id).subscribe(project => {
      const index = this.items.findIndex(project => project.id === id);
      this.items[index] = project;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.componentsHttpService.remove(id).subscribe((project) => {
            this.items = this.items.filter(item => item.id !== project.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findComponents(event.page);
  }

  selectItem(item: ComponentModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
