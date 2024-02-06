import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {TeacherModel, ColumnModel, PaginatorModel, SelectTeacherDto} from '@models/core';
import {BreadcrumbService, TeachersHttpService, CoreService, MessageService, RoutesService} from '@services/core';
import {BreadcrumbEnum} from "@shared/enums";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TeacherListComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected columns: ColumnModel[] = this.buildColumns;
  protected isButtonActions: boolean = false;
  protected paginator: PaginatorModel;
  protected search: FormControl = new FormControl('');
  protected selectedItem: SelectTeacherDto = {};
  protected selectedItems: TeacherModel[] = [];
  protected items: TeacherModel[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private teachersHttpService: TeachersHttpService,
    public coreService: CoreService,
    private routesService: RoutesService,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.TEACHERS},
    ]);

    this.paginator = this.coreService.paginator;

    this.search.valueChanges.subscribe((value: string | any[]) => {
      if (value.length === 0) {
        this.findAll();
      }
    });
  }

  ngOnInit() {
    this.findAll();
  }

  findAll(page: number = 0) {
    this.teachersHttpService.findAll(page, this.search.value)
      .subscribe((response: any) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'user', header: 'Nombre'},
      {field: 'code', header: 'Codigo'},
      {field: 'teacherHour', header: 'Horas profesor'},
      {field: 'practicalHour', header: 'Horas practicas'},
      {field: 'scale', header: 'Escala'},
      {field: 'credit', header: 'Credito'},
    ];
  }

  get buildButtonActions(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: PrimeIcons.PENCIL,
        command: () => {
          if (this.selectedItem?.id) this.redirectEditForm(this.selectedItem.id);
        },
      },
    ];
  }

  removeAll() {
    this.messageService.questionDelete().then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.teachersHttpService.removeAll(this.selectedItems).subscribe((Teachers: any) => {
          this.selectedItems.forEach(ItemDeleted => {
            this.items = this.items.filter(item => item.id !== ItemDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedItems = [];
        });
      }
    });
  }

   /** Select & Paginate **/
  selectItem(item: TeacherModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  /** Redirects **/
  redirectCreateForm() {
    this.router.navigate([this.routesService.teachersCoordinatorCareer, 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.teachersCoordinatorCareer, id]);
  }
}
