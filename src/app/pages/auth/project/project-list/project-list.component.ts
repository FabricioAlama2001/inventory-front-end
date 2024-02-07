import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {MenuItem, PrimeIcons} from "primeng/api";

import {ProjectModel} from '@models/auth';
import {ColumnModel, PaginatorModel} from '@models/core';
import {AuthService, ProjectHttpService} from '@services/auth';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum
} from "@shared/enums";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-project-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected paginator: PaginatorModel;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: ProjectModel;
  protected selectedItems: ProjectModel[] = [];
  protected items: ProjectModel[] = [];

  constructor(
    protected readonly authService: AuthService,
    protected readonly coreService: CoreService,
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly projectsHttpService: ProjectHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.PROJECTS}]);

    this.paginator = this.coreService.paginator;

    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findProjects();
    });
  }

  ngOnInit() {
    this.findProjects();
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
      {field: 'code', header: 'Codigo'},
      {field: 'name', header: 'Nombre'},
      {field: 'description', header: 'Descripción'},
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
        id: IdButtonActionEnum.SUSPEND,
        label: LabelButtonActionEnum.SUSPEND,
        icon: IconButtonActionEnum.SUSPEND,
        command: () => {
          if (this.selectedItem?.id) this.suspend(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.REACTIVATE,
        label: LabelButtonActionEnum.REACTIVATE,
        icon: IconButtonActionEnum.REACTIVATE,
        command: () => {
          if (this.selectedItem?.id) this.reactivate(this.selectedItem.id);
        },
      },
    ];
  }

  redirectCreateForm() {
    this.router.navigate(['/admin/projects', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/admin/projects', id]);
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

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.projectsHttpService.removeAll(this.selectedItems).subscribe((projects) => {
          this.selectedItems.forEach(projectDeleted => {
            this.items = this.items.filter(project => project.id !== projectDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedItems = [];
        });
      }
    });
  }

  suspend(id: string) {
    this.projectsHttpService.suspend(id).subscribe(project => {
      const index = this.items.findIndex(project => project.id === id);
      this.items[index] = project;
    });
  }

  reactivate(id: string) {
    this.projectsHttpService.reactivate(id).subscribe(project => {
      const index = this.items.findIndex(project => project.id === id);
      this.items[index] = project;
    });
  }

  validateButtonActions(item: ProjectModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.suspendedAt) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.SUSPEND), 1);
    }

    if (!item.suspendedAt) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.REACTIVATE), 1);
    }
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
