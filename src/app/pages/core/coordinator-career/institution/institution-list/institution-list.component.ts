import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {MenuItem, PrimeIcons} from "primeng/api";
import {ColumnModel, InstitutionModel, SelectInstitutionDto, PaginatorModel} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  InstitutionsHttpService,
  InstitutionsService,
  MessageService,
  RoutesService
} from '@services/core';
import {
  IdButtonActionEnum,
  BreadcrumbEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  ClassButtonActionEnum
} from "@shared/enums";

@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.scss'],
})
export class InstitutionListComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected columns: ColumnModel[] = this.buildColumns;
  protected isButtonActions: boolean = false;
  protected search: FormControl = new FormControl('');
  protected selectedItem: SelectInstitutionDto = {};
  protected selectedItems: InstitutionModel[] = [];
  protected items: InstitutionModel[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    public coreService: CoreService,
    public messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private institutionsHttpService: InstitutionsHttpService,
    protected institutionsService: InstitutionsService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONS},
    ]);

    this.search.valueChanges.subscribe((value: string | any[]) => {
      if (value.length === 0) {
        this.findInstitutionsByAuthenticatedUser();
      }
    });
  }

  ngOnInit() {
    this.findInstitutionsByAuthenticatedUser();
  }

  /** Build Data **/
  get buildColumns(): ColumnModel[] {
    return [
      {field: 'acronym', header: 'Siglas'},
      {field: 'name', header: 'Nombre'},
      {field: 'email', header: 'Email'},
      {field: 'cellphone', header: 'Teléfono'},
      {field: 'isVisible', header: 'Estado'},
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
        id: IdButtonActionEnum.REACTIVATE,
        label: 'Habilitar',
        icon: PrimeIcons.EYE,
        command: () => {
          if (this.selectedItem?.id) this.reactivate(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.HIDE,
        label: 'Inhabilitar',
        icon: PrimeIcons.EYE_SLASH,
        command: () => {
          if (this.selectedItem?.id) this.hide(this.selectedItem.id);
        },
      },
    ];
  }

  validateButtonActions(item: InstitutionModel) {
    this.buttonActions = this.buildButtonActions;

    if (item.isVisible) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.REACTIVATE), 1);
    }

    if (!item.isVisible) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.HIDE), 1);
    }

    if (item.id === this.institutionsService.institution.id) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.SELECT), 1);
    }
  }

  /** Actions **/
  findInstitutionsByAuthenticatedUser() {
    this.institutionsHttpService.findInstitutionsByAuthenticatedUser()
      .subscribe((response: InstitutionModel[]) => {
        this.items = response;
      });
  }

  refresh() {
    this.institutionsHttpService.findInstitutionsByAuthenticatedUser().subscribe((institutions: SelectInstitutionDto[]) => {
      this.institutionsService.institutions = institutions;
    })
  }
  reactivate(id: string) {
    this.institutionsHttpService.reactivate(id).subscribe(() => {
      const index = this.items.findIndex(item => item.id === id);
      this.items[index].isVisible = true;
    });
  }

  hide(id: string) {
    this.institutionsHttpService.hide(id).subscribe((item: any) => {
      const index = this.items.findIndex(item => item.id === id);
      this.items[index].isVisible = false;
    });
  }

  change(item: SelectInstitutionDto) {
    this.institutionsService.institution = item;
    this.messageService.successCustom('Ha cambiado de Institución', 'La Institución seleccionada se configura para todo el sistema');
  }

  selectItem(item: InstitutionModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }

  /** Redirects **/
  redirectCreateForm() {
    this.router.navigate([this.routesService.institutions, 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.institutions, id]);
  }

  redirectCareers() {
    this.router.navigate([this.routesService.careers]);
  }
}


