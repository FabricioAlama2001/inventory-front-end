import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ColumnModel, PaginatorModel, ProjectModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, ProjectsHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, ProjectsFormEnum, RoutesEnum, TableEnum
} from "@shared/enums";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
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

  protected selectedItem!: ProjectModel;
  protected selectedItems: ProjectModel[] = [];
  protected items: ProjectModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly projectsHttpService: ProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.PROJECTS}]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findProjects();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findProjects();
    });
  }

  findProjects(page: number = 0) {
    this.projectsHttpService.findProjects(page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'pndObjective', header: ProjectsFormEnum.pndObjective},
      {field: 'pndPolice', header: ProjectsFormEnum.pndPolice},
      {field: 'expenseType', header: ProjectsFormEnum.expenseType},
      {field: 'name', header: ProjectsFormEnum.name},
      {field: 'fiscalYear', header: ProjectsFormEnum.fiscalYear},
      {field: 'enabled', header: ProjectsFormEnum.enabled},
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
        label: LabelButtonActionEnum.COMPONENTS,
        icon: IconButtonActionEnum.ENABLE,
        command: () => {
          if (this.selectedItem?.id) this.redirectComponentsList(this.selectedItem.id);
        },
      },
    ];
  }

  validateButtonActions(item: ProjectModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.projectsForm(RoutesEnum.NEW)]);
  }

  redirectComponentsList(id:string) {
    this.router.navigate([this.routesService.components(id)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.projectsForm(id)]);
  }

  disable(id: string) {
    this.projectsHttpService.disable(id).subscribe(project => {
      const index = this.items.findIndex(project => project.id === id);
      this.items[index] = project;
    });
  }

  enable(id: string) {
    this.projectsHttpService.enable(id).subscribe(project => {
      const index = this.items.findIndex(project => project.id === id);
      this.items[index] = project;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.projectsHttpService.remove(id).subscribe((project) => {
            this.items = this.items.filter(item => item.id !== project.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findProjects(event.page);
  }

  selectItem(item: ProjectModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
