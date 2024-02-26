import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ColumnModel, PaginatorModel, ComponentModel, ProjectModel} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  ComponentsHttpService,
  RoutesService,
  ProjectsHttpService
} from '@services/core';
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
export class ComponentListComponent implements OnInit {
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

  protected projects: ProjectModel[] = [];
  protected project: FormControl = new FormControl(null);

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly componentsHttpService: ComponentsHttpService,
    private readonly projectsHttpService: ProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.PROJECTS, routerLink: [this.routesService.projectsList]},
      {label: BreadcrumbEnum.COMPONENTS}
    ]);

    console.log('asd');
    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.loadProjects();

    this.checkValueChanges();
    if (this.projectId) {
      this.findComponentsByProject();
    }
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findComponentsByProject();
    });

    this.project.valueChanges.subscribe(value => {
      if (value) {
        this.projectId = value.id;
        this.findComponentsByProject();
      }
    });
  }

  findComponentsByProject(page: number = 0) {
    this.projectsHttpService.findComponentsByProject(this.projectId, page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: ComponentsFormEnum.code},
      {field: 'name', header: ComponentsFormEnum.name},
      {field: 'project', header: ComponentsFormEnum.project},
      {field: 'indicatorComponent', header: ComponentsFormEnum.indicatorComponent},
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
      {
        id: IdButtonActionEnum.ENABLE,
        label: LabelButtonActionEnum.ACTIVITIES,
        icon: IconButtonActionEnum.ENABLE,
        command: () => {
          if (this.selectedItem?.id) this.redirectActivitiesList(this.selectedItem.id);
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

  loadProjects(): void {
    this.projectsHttpService.findCatalogues().subscribe((projects) => {
      this.projects = projects;
      this.project.patchValue(this.projects.find(item => item.id === this.projectId));
    });
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.componentsForm(this.projectId, RoutesEnum.NEW)]);
  }

  redirectActivitiesList(id:string) {
    this.router.navigate([this.routesService.activitiesList(id)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.componentsForm(this.projectId, id)]);
  }

  disable(id: string) {
    this.componentsHttpService.disable(id).subscribe(component => {
      const index = this.items.findIndex(component => component.id === id);
      this.items[index] = component;
    });
  }

  enable(id: string) {
    this.componentsHttpService.enable(id).subscribe(component => {
      const index = this.items.findIndex(component => component.id === id);
      this.items[index] = component;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.componentsHttpService.remove(id).subscribe((component) => {
            this.items = this.items.filter(item => item.id !== component.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findComponentsByProject(event.page);
  }

  selectItem(item: ComponentModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }

}
