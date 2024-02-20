import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {InstitutionalStrategicPlanModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, RoutesService, InstitutionalStrategicPlansHttpService} from '@services/core';
import {
  BreadcrumbEnum,
  InstitutionalStrategicPlansFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";


@Component({
  selector: 'app-institutional-strategic-plan-list',
  templateUrl: './institutional-strategic-plan-list.component.html',
  styleUrl: './institutional-strategic-plan-list.component.scss'
})
export class InstitutionalStrategicPlanListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly InstitutionalStrategicPlansFormEnum = InstitutionalStrategicPlansFormEnum;
  protected readonly IdButtonActionEnum = IdButtonActionEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: InstitutionalStrategicPlanModel;
  protected selectedItems: InstitutionalStrategicPlanModel[] = [];
  protected items: InstitutionalStrategicPlanModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly institutionalStrategicPlansHttpService: InstitutionalStrategicPlansHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.INSTITUTIONAL_STRATEGIC_PLANS}]);
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
    this.institutionalStrategicPlansHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: InstitutionalStrategicPlansFormEnum.code},
      {field: 'name', header: InstitutionalStrategicPlansFormEnum.name},
      {field: 'sort', header: InstitutionalStrategicPlansFormEnum.sort},
      {field: 'enabled', header: InstitutionalStrategicPlansFormEnum.enabled}
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

  validateButtonActions(item: InstitutionalStrategicPlanModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.institutionalStrategicPlansForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.institutionalStrategicPlansForm(id)]);
  }

  disable(id: string) {
    this.institutionalStrategicPlansHttpService.disable(id).subscribe(institutionalStrategicPlan => {
      const index = this.items.findIndex(institutionalStrategicPlan => institutionalStrategicPlan.id === id);
      this.items[index] = institutionalStrategicPlan;
    });
  }

  enable(id: string) {
    this.institutionalStrategicPlansHttpService.enable(id).subscribe(institutionalStrategicPlan => {
      const index = this.items.findIndex(institutionalStrategicPlan => institutionalStrategicPlan.id === id);
      this.items[index] = institutionalStrategicPlan;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.institutionalStrategicPlansHttpService.remove(id).subscribe((institutionalStrategicPlan) => {
            this.items = this.items.filter(item => item.id !== institutionalStrategicPlan.id);
          });
        }
      });
  }

  selectItem(item: InstitutionalStrategicPlanModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
