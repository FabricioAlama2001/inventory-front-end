import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {Table} from 'primeng/table';
import {ColumnModel, CurriculumModel, SelectCurriculumDto, SelectCareerDto} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  RoutesService,
  CurriculumsHttpService, CareersService, CareersHttpService
} from '@services/core';
import {CurriculumsService} from "@services/core/curriculums.service";
import {
  IdButtonActionEnum,
  BreadcrumbEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  ClassButtonActionEnum
} from "@shared/enums";

@Component({
  selector: 'app-curriculum-list',
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['./curriculum-list.component.scss'],

})
export class CurriculumListComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected columns: ColumnModel[] = this.buildColumns;
  protected isButtonActions: boolean = false;
  protected search: FormControl = new FormControl('');
  protected selectedItem: SelectCurriculumDto = {};
  protected selectedItems: CurriculumModel[] = [];
  protected items: CurriculumModel[] = [];
  protected selectedCareer: FormControl = new FormControl();
  protected careers: SelectCareerDto[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    public coreService: CoreService,
    public messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private curriculumsHttpService: CurriculumsHttpService,
    private curriculumsService: CurriculumsService,
    private careersHttpService: CareersHttpService,
    private careersService: CareersService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONS, routerLink: routesService.institutions},
      {label: BreadcrumbEnum.CAREERS, routerLink: routesService.careers},
      {label: BreadcrumbEnum.CURRICULUMS},
    ]);

    this.careers = this.careersService.careers;

    this.selectedCareer.patchValue(this.careersService.career);

    this.search.valueChanges.subscribe(value => {
      if (value.length === 0) {
        this.findByCareer();
      }
    });

    this.selectedCareer.valueChanges.subscribe(selectCareer => {
      this.findByCareer();
    });
  }

  ngOnInit() {
    this.findByCareer();
  }

  /** Load Data **/
  findByCareer() {
    this.careersHttpService.findCurriculumsByCareer(this.selectedCareer.value.id)
      .subscribe((response) => {
        this.items = response;
      });
  }

  /** Build Data **/
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: 'Código'},
      {field: 'name', header: 'Nombre'},
      {field: 'periodicAcademicNumber', header: '# Periodos académicos'},
      {field: 'weeksNumber', header: '# Semanas'},
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

      }
    ];
  }

  validateButtonActions(item: CurriculumModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.isVisible) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.REACTIVATE), 1);
    }

    if (!item.isVisible) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.HIDE), 1);
    }
  }

  /** Actions **/

  hide(id: string) {
    this.curriculumsHttpService.hide(id).subscribe(item => {
      const index = this.items.findIndex(item => item.id === id);
      this.items[index].isVisible = false;
    });
  }

  reactivate(id: string) {
    this.curriculumsHttpService.reactivate(id).subscribe(item => {
      const index = this.items.findIndex(item => item.id === id);
      this.items[index].isVisible = true;
    });
  }

  /** Select & Paginate **/
  selectItem(item: CurriculumModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.curriculumsService.curriculum = item;
    this.validateButtonActions(item);
  }

  clear(table: Table) {
    table.clear();
  }

  /** Redirects **/
  redirectCreateForm() {
    this.router.navigate([this.routesService.curriculums, 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.curriculums, id]);
  }

  redirectSubjects() {
    this.router.navigate([this.routesService.subjects]);
  }

  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
}
