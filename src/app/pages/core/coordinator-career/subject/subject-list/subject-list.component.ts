import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {ColumnModel, SubjectModel, CurriculumModel, CareerModel} from '@models/core';
import {
  BreadcrumbService,
  CareersService,
  CoreService,
  CurriculumsHttpService,
  CurriculumsService,
  MessageService,
  RoutesService,
  SubjectsHttpService,
  SubjectsService,
} from '@services/core';
import {
  BreadcrumbEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum,
  IconButtonActionEnum,
  ClassButtonActionEnum
} from "@shared/enums";

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss'],

})
export class SubjectListComponent implements OnInit {
  // Reference Prime Icons
  protected readonly PrimeIcons = PrimeIcons;

  // Button Actions Enum
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;

  protected buttonActions: MenuItem[] = [];

  // Columns of table
  protected columns: ColumnModel[] = this.buildColumns;

  // Flag actions buttons is enabled
  protected isButtonActions: boolean = false;

  // Flag upload files is enabled
  protected isFileList: boolean = false;

  // Administrator Data
  protected selectedItem!: SubjectModel;
  protected selectedItems: SubjectModel[] = [];
  protected items: SubjectModel[] = [];

  // Foreign Keys
  protected selectedCareer: FormControl = new FormControl();
  protected selectedCurriculum: FormControl = new FormControl();
  protected careers: CareerModel[] = [];
  protected curriculums: CurriculumModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly careersService: CareersService,
    private readonly curriculumsHttpService: CurriculumsHttpService,
    private readonly curriculumsService: CurriculumsService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly subjectsHttpService: SubjectsHttpService,
    private readonly subjectsService: SubjectsService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONS, routerLink: [this.routesService.institutions]},
      {label: BreadcrumbEnum.CAREERS, routerLink: [this.routesService.careers]},
      {label: BreadcrumbEnum.CURRICULUMS, routerLink: [this.routesService.curriculums]},
      {label: BreadcrumbEnum.SUBJECTS},
    ]);

    this.careers = this.careersService.careers;

    this.selectedCareer.patchValue(this.careersService.career);

    this.curriculums = this.careersService.career.curriculums;

    if (this.curriculums.length > 0) {
      this.selectedCurriculum.patchValue(this.curriculums[0]);
      this.curriculumsService.curriculum = this.curriculums[0];
      this.findSubjectsAllByCurriculum();
    }

    this.selectedCareer.valueChanges.subscribe(selectedCareer => {
      this.items = [];
      this.curriculumsService.curriculum = {};

      if (selectedCareer.curriculums.length > 0) {
        this.selectedCurriculum.patchValue(selectedCareer.curriculums[0]);
        this.curriculumsService.curriculum = selectedCareer.curriculums[0];
        this.curriculums = selectedCareer.curriculums;
        this.findSubjectsAllByCurriculum();
      }
    });
  }

  ngOnInit() {
    if (this.selectedCurriculum.value)
      this.findSubjectsAllByCurriculum();
  }

  /** Load Data **/
  findSubjectsAllByCurriculum() {
    this.curriculumsHttpService.findSubjectsAllByCurriculum(this.selectedCurriculum.value.id)
      .subscribe(subjects => {
        this.items = subjects;
      });
  }

  /** Build Columns & Button Actions **/
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: 'Código'},
      {field: 'name', header: 'Nombre'},
      {field: 'hours', header: 'Horas Doc. / Prac. / Aut.'},
      {field: 'academicPeriod', header: 'Periodo académico'},
      {field: 'type', header: 'Tipo'},
      {field: 'state', header: 'Estado'}
    ];
  }

  get buildButtonActions() {
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
        id: IdButtonActionEnum.HIDE,
        label: LabelButtonActionEnum.HIDE,
        icon: IconButtonActionEnum.HIDE,
        command: () => {
          if (this.selectedItem?.id) this.hide(this.selectedItem.id);
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
      {
        id: IdButtonActionEnum.FILE_LIST,
        label: LabelButtonActionEnum.FILE_LIST,
        icon: IconButtonActionEnum.FILE_LIST,
        command: () => {
          if (this.selectedItem?.id) this.isFileList=true;
        },

      }
    ];
  }

  validateButtonActions(item: SubjectModel): void {
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
    this.subjectsHttpService.hide(id).subscribe(item => {
      const index = this.items.findIndex(item => item.id === id);
      this.items[index].isVisible = false;
    });
  }

  reactivate(id: string) {
    this.subjectsHttpService.reactivate(id).subscribe(item => {
      const index = this.items.findIndex(item => item.id === id);
      this.items[index].isVisible = true;
    });
  }

  /** Select **/
  selectItem(item: SubjectModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.subjectsService.subject = item;
    this.validateButtonActions(item);
  }

  /** Redirects **/
  redirectCreateForm() {
    this.router.navigate([this.routesService.subjects, 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.subjects, id]);
  }
}
