import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {ApplicationStatusModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  ApplicationStatusFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";
import { ApplicationStatusHttpService } from '@services/core/application-status-http.service';


@Component({
  selector: 'app-application-status-list',
  templateUrl: './application-status-list.component.html',
  styleUrl: './application-status-list.component.scss'
})
export class ApplicationStatusListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly ApplicationStatusFormEnum = ApplicationStatusFormEnum;
  protected readonly IdButtonActionEnum = IdButtonActionEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: ApplicationStatusModel;
  protected selectedItems: ApplicationStatusModel[] = [];
  protected items: ApplicationStatusModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly applicationStatusHttpService: ApplicationStatusHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.APPLICATION_STATUS}]);
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findAll();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findAll();
    });
  }

  findAll() {
    this.applicationStatusHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: ApplicationStatusFormEnum.code},
      {field: 'name', header: ApplicationStatusFormEnum.name},
      {field: 'enabled', header: ApplicationStatusFormEnum.enabled}
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

  validateButtonActions(item: ApplicationStatusModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.applicationStatusForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.applicationStatusForm(id)]);
  }

  disable(id: string) {
    this.applicationStatusHttpService.disable(id).subscribe(applicationStatus => {
      const index = this.items.findIndex(applicationStatus => applicationStatus.id === id);
      this.items[index] = applicationStatus;
    });
  }

  enable(id: string) {
    this.applicationStatusHttpService.enable(id).subscribe(applicationStatus => {
      const index = this.items.findIndex(applicationStatus => applicationStatus.id === id);
      this.items[index] = applicationStatus;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.applicationStatusHttpService.remove(id).subscribe((applicationStatus) => {
            this.items = this.items.filter(item => item.id !== applicationStatus.id);
          });
        }
      });
  }

  selectItem(item: ApplicationStatusModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
