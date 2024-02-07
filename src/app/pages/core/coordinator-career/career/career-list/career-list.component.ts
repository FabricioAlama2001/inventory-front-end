import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {ColumnModel, CareerModel, SelectCareerDto, SelectInstitutionDto} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  RoutesService,
} from '@services/core';
import {
    IdButtonActionEnum,
    BreadcrumbEnum,
    IconButtonActionEnum,
    ClassButtonActionEnum,
    LabelButtonActionEnum
} from "@shared/enums";

@Component({
  selector: 'app-career-list',
  templateUrl: './career-list.component.html',
  styleUrls: ['./career-list.component.scss'],

})
export class CareerListComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;

  protected readonly BreadcrumbEnum = BreadcrumbEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;
  protected columns: ColumnModel[] = this.buildColumns;
  protected selectedItem!: CareerModel;
  protected selectedItems: CareerModel[] = [];
  protected items: SelectCareerDto[] = [];

  protected selectedInstitution: FormControl = new FormControl();
  protected institutions: SelectInstitutionDto[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    public readonly coreService: CoreService,
    public readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONS, routerLink: routesService.institutions},
      {label: BreadcrumbEnum.CAREERS},
    ]);

    this.selectedInstitution.valueChanges.subscribe((_: any) => {
      this.findCareersByInstitution();
    });
  }

  ngOnInit() {
    this.findCareersByInstitution();
  }

  /** Load Data **/
  findCareersByInstitution() {
    // this.items = this.careersService.careers.filter(career => career.institution?.id === this.selectedInstitution.value.id);
    if (this.items.length === 0) {
      this.messageService.successCustom('No hay registros', 'No tiene carreras asignadas para esta institución');
    }
  }

  refresh() {
    // this.careersHttpService.findCareersByAuthenticatedUser().subscribe((careers: CareerModel[]) => {
    //   this.careersService.careers = careers;
    //   this.findCareersByInstitution();
    // })
  }

  /** Build Data **/
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: 'Código'},
      {field: 'name', header: 'Nombre'},
      {field: 'shortName', header: 'Nombre Corto'},
      {field: 'degree', header: 'Título'},
      {field: 'isVisible', header: 'Estado'}
    ];
  }

  get buildButtonActions() {
    return [
      {
        id: IdButtonActionEnum.UPDATE,
        label: 'Editar',
        icon: PrimeIcons.PENCIL,
        command: () => {
          if (this.selectedItem?.id) this.redirectEditForm(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.SELECT,
        label: 'Seleccionar',
        icon: PrimeIcons.SYNC,
        command: () => {
          if (this.selectedItem?.id) this.change(this.selectedItem);
        },
      },
      {
        id: IdButtonActionEnum.HIDE,
        label: 'Ocultar',
        icon: PrimeIcons.EYE_SLASH,
        command: () => {
          if (this.selectedItem?.id) this.hide(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.REACTIVATE,
        label: 'Mostrar',
        icon: PrimeIcons.EYE,
        command: () => {
          if (this.selectedItem?.id) this.reactivate(this.selectedItem.id);
        },

      },
      // {
      //   id: IdButtonActionEnum.PARALLEL_CAPACITY,
      //   label: LabelButtonActionEnum.PARALLEL_CAPACITY,
      //   icon: IconButtonActionEnum.PARALLEL_CAPACITY,
      //   command: () => {
      //     if (this.selectedItem?.id) this.redirectParallelsCapacity();
      //   },
      //
      // }
    ];
  }

  validateButtonActions(item: CareerModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.isVisible) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.REACTIVATE), 1);
    }

    if (!item.isVisible) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.HIDE), 1);
    }
  }

  /** Actions **/
  change(item: CareerModel) {
    // this.careersService.career = item;
    this.messageService.successCustom('Ha cambiado de Carrera', 'La Carrera seleccionada se configura para todo el sistema');
  }

  hide(id: string) {
    // this.careersHttpService.hide(id).subscribe((item: any) => {
    //   const index = this.items.findIndex(item => item.id === id);
    //   this.items[index].isVisible = false;
    // });
  }

  reactivate(id: string) {
    // this.careersHttpService.reactivate(id).subscribe(() => {
    //   const index = this.items.findIndex(item => item.id === id);
    //   this.items[index].isVisible = true;
    // });
  }

  selectItem(item: CareerModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }

  /** Redirects **/
  redirectCreateForm() {
    this.router.navigate([this.routesService.careers, 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.careers, id]);
  }

  redirectCurriculums() {
    this.router.navigate([this.routesService.curriculums]);
  }

  redirectSubjects() {
    this.router.navigate([this.routesService.subjects]);
  }

  redirectParallelsCapacity() {
    this.router.navigate([this.routesService.parallelCapacity]);
  }
}
