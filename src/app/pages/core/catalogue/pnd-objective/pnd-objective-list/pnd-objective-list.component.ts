import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import { ColumnModel, PndObjectiveModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, PndObjectivesHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  PndObjectivesFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";

@Component({
  selector: 'app-pnd-objective-list',
  templateUrl: './pnd-objective-list.component.html',
  styleUrl: './pnd-objective-list.component.scss'
})
export class PndObjectiveListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly PndObjectivesFormEnum = PndObjectivesFormEnum;
  protected readonly IdButtonActionEnum = IdButtonActionEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: PndObjectiveModel;
  protected selectedItems: PndObjectiveModel[] = [];
  protected items: PndObjectiveModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly pndObjectivesHttpService: PndObjectivesHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.PND_OBJECTIVES}]);
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
    this.pndObjectivesHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: PndObjectivesFormEnum.code},
      {field: 'name', header: PndObjectivesFormEnum.name},
      {field: 'sort', header: PndObjectivesFormEnum.sort},
      {field: 'enabled', header: PndObjectivesFormEnum.enabled}
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

  validateButtonActions(item: PndObjectiveModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.pndObjectivesForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.pndObjectivesForm(id)]);
  }

  disable(id: string) {
    this.pndObjectivesHttpService.disable(id).subscribe(pndObjective => {
      const index = this.items.findIndex(pndObjective => pndObjective.id === id);
      this.items[index] = pndObjective;
    });
  }

  enable(id: string) {
    this.pndObjectivesHttpService.enable(id).subscribe(pndObjective => {
      const index = this.items.findIndex(pndObjective => pndObjective.id === id);
      this.items[index] = pndObjective;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.pndObjectivesHttpService.remove(id).subscribe((pndObjective) => {
            this.items = this.items.filter(item => item.id !== pndObjective.id);
          });
        }
      });
  }

  selectItem(item:  PndObjectiveModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
