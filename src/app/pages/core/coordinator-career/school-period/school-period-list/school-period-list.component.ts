import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {
  ColumnModel,
  PaginatorModel,
  SchoolPeriodModel,
  SelectSchoolPeriodDto
} from '@models/core';
import {
  BreadcrumbService,
  CoreService, EventsService,
  MessageService,
  RoutesService,
  SchoolPeriodsHttpService
} from '@services/core';
import {
  IdButtonActionEnum,
  BreadcrumbEnum,
  CatalogueSchoolPeriodStateEnum,
  IconButtonActionEnum, LabelButtonActionEnum, ClassButtonActionEnum
} from "@shared/enums";

@Component({
  selector: 'app-school-period-list',
  templateUrl: './school-period-list.component.html',
  styleUrls: ['./school-period-list.component.scss'],
})
export class SchoolPeriodListComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected buttonActions: MenuItem[] = [];
  protected columns: ColumnModel[] = this.buildColumns;
  protected isButtonActions: boolean = false;
  protected isFileList: boolean = false;
  protected paginator: PaginatorModel;
  protected search: FormControl = new FormControl('');
  protected selectedItem: SelectSchoolPeriodDto = {};
  protected selectedItems: SchoolPeriodModel[] = [];
  protected items: SchoolPeriodModel[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    public coreService: CoreService,
    public messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private schoolPeriodsHttpService: SchoolPeriodsHttpService,
    private eventsService: EventsService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.SCHOOL_PERIODS},
    ]);

    this.paginator = this.coreService.paginator;

    this.search.valueChanges.subscribe((value: string | any[]) => {
      if (value.length === 0) {
        this.find();
      }
    });
  }

  ngOnInit() {
    this.find();
  }

  /** Load Data **/
  find(page: number = 0) {
    this.schoolPeriodsHttpService.find(page, this.search.value)
      .subscribe((response: any) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  /** Build Data **/
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Nombre'},
      {field: 'startedAt', header: 'Fecha Inicio'},
      {field: 'endedAt', header: 'Fecha Fin'},
      {field: 'state', header: 'Estado'},
      {field: 'isVisible', header: 'Es Visible'}
    ];
  }

  buildButtonActions(): void {
    this.buttonActions = [];

    this.buttonActions.push(
      {
        id: IdButtonActionEnum.UPDATE,
        label: 'Actualizar',
        icon: PrimeIcons.PENCIL,
        command: () => {
          if (this.selectedItem?.id) this.redirectEditForm(this.selectedItem.id);
        },
      });

    this.buttonActions.push(
      {
        id: IdButtonActionEnum.DELETE,
        label: 'Eliminar',
        icon: PrimeIcons.TRASH,
        command: () => {
          if (this.selectedItem?.id) this.remove(this.selectedItem.id);
        },
      });

    this.buttonActions.push(
      {
        id: IdButtonActionEnum.HIDE,
        label: 'Ocultar',
        icon: PrimeIcons.EYE_SLASH,
        command: () => {
          if (this.selectedItem?.id) this.hide(this.selectedItem.id);
        },
      });

    this.buttonActions.push(
      {
        id: IdButtonActionEnum.REACTIVATE,
        label: 'Mostrar',
        icon: PrimeIcons.EYE,
        command: () => {
          if (this.selectedItem?.id) this.reactivate(this.selectedItem.id);
        },

      });

    this.buttonActions.push(
      {
        id: IdButtonActionEnum.SHOW_EVENTS,
        label: 'Eventos',
        icon: PrimeIcons.BARS,
        command: () => {
          if (this.selectedItem?.id) this.redirectEventList();
        },
      });

    this.buttonActions.push(
      {
        id: IdButtonActionEnum.OPEN_SCHOOL_PERIOD,
        label: 'Abrir Periodo Lectivo',
        icon: PrimeIcons.LOCK_OPEN,
        command: () => {
          if (this.selectedItem?.id) this.open(this.selectedItem.id);
        },
      });

    this.buttonActions.push(
      {
        id: IdButtonActionEnum.CLOSE_SCHOOL_PERIOD,
        label: 'Cerrar Periodo Lectivo',
        icon: PrimeIcons.UNLOCK,
        command: () => {
          if (this.selectedItem?.id) this.close(this.selectedItem.id);
        },
      });

    this.buttonActions.push(
      {
        id: IdButtonActionEnum.FILE_LIST,
        label: 'Archivos',
        icon: PrimeIcons.FILE,
        command: () => {
          if (this.selectedItem?.id) this.isFileList = true;
        },
      });

    /** Button Actions Validations **/
    if (this.selectedItem.state?.code === CatalogueSchoolPeriodStateEnum.CLOSE) {
      // this.buttonActions = this.buttonActions.filter(actionButton => {
      //   return actionButton.id !== IdButtonActionEnum.SHOW_EVENTS && actionButton.id !== IdButtonActionEnum.CLOSE_SCHOOL_PERIOD;
      // });

      let index = this.buttonActions.findIndex(actionButton => {
        return actionButton.id === IdButtonActionEnum.SHOW_EVENTS;
      });

      this.buttonActions.splice(index, 1);

      index = this.buttonActions.findIndex(actionButton => {
        return actionButton.id === IdButtonActionEnum.CLOSE_SCHOOL_PERIOD;
      });

      this.buttonActions.splice(index, 1);
    }

    if (this.selectedItem.state?.code === CatalogueSchoolPeriodStateEnum.OPEN) {
      // this.buttonActions = this.buttonActions.filter(actionButton => {
      //   return actionButton.id !== IdButtonActionEnum.OPEN_SCHOOL_PERIOD;
      // });

      const index = this.buttonActions.findIndex(actionButton => {
        return actionButton.id === IdButtonActionEnum.OPEN_SCHOOL_PERIOD;
      });

      this.buttonActions.splice(index, 1);
    }

    if (this.selectedItem.isVisible) {
      const index = this.buttonActions.findIndex(actionButton => {
        return actionButton.id === IdButtonActionEnum.REACTIVATE;
      });

      this.buttonActions.splice(index, 1);
    }

    if (!this.selectedItem.isVisible) {
      const index = this.buttonActions.findIndex(actionButton => {
        return actionButton.id === IdButtonActionEnum.HIDE;
      });

      this.buttonActions.splice(index, 1);
    }
  }

  /** Actions **/
  remove(id: string) {
    this.messageService.questionDelete()
      .then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed) {
          this.schoolPeriodsHttpService.remove(id).subscribe(() => {
            this.items = this.items.filter(item => item.id !== id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.schoolPeriodsHttpService.removeAll(this.selectedItems).subscribe(() => {
          this.selectedItems.forEach(itemDeleted => {
            this.items = this.items.filter(item => item.id !== itemDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedItems = [];
        });
      }
    });
  }

  hide(id: string) {
    this.schoolPeriodsHttpService.hide(id).subscribe((item: any) => {
      const index = this.items.findIndex(item => item.id === id);
      this.items[index].isVisible = false;
    });
  }

  reactivate(id: string) {
    this.schoolPeriodsHttpService.reactivate(id).subscribe(() => {
      const index = this.items.findIndex(item => item.id === id);
      this.items[index].isVisible = true;
    });
  }

  open(id: string) {
    this.schoolPeriodsHttpService.open(id).subscribe((item: any) => {
      this.find();
    });
  }

  close(id: string) {
    this.schoolPeriodsHttpService.close(id).subscribe((item: any) => {
      this.find();
    });
  }

  /** Select & Paginate **/
  selectItem(item: SchoolPeriodModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.buildButtonActions();
  }

  paginate(event: any) {
    this.find(event.page);
  }

  /** Redirects **/
  redirectCreateForm() {
    this.router.navigate([this.routesService.schoolPeriods, 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.schoolPeriods, id]);
  }

  redirectEventList() {
    this.eventsService.model = {
      entity: this.selectedItem,
      label: 'Periodo Lectivo',
      routerLink: this.routesService.schoolPeriods,
      routerLabel: 'Periodos Lectivos',
    };

    this.router.navigate([this.routesService.events]);
  }

  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
}
