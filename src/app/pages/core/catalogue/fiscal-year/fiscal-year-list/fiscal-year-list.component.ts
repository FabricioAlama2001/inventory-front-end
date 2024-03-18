import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {debounceTime} from "rxjs";

import {MenuItem, PrimeIcons} from "primeng/api";

import {FiscalYearModel, ColumnModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, FiscalYearsHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  FiscalYearsFormEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, RoutesEnum, TableEnum
} from "@shared/enums";
import {getHigherSort} from "@shared/helpers";

@Component({
  selector: 'app-fiscal-year-list',
  templateUrl: './fiscal-year-list.component.html',
  styleUrl: './fiscal-year-list.component.scss'
})
export class FiscalYearListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly FiscalYearsFormEnum = FiscalYearsFormEnum;
  protected readonly TableEnum = TableEnum;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: FiscalYearModel;
  protected selectedItems: FiscalYearModel[] = [];
  protected items: FiscalYearModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly fiscalYearsHttpService: FiscalYearsHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.EXPENSE_TYPES}]);
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
    this.fiscalYearsHttpService.findAll()
      .subscribe((response) => {
        this.items = response;
        this.coreService.higherSort = getHigherSort(this.items);
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: FiscalYearsFormEnum.code},
      {field: 'name', header: FiscalYearsFormEnum.name},
      {field: 'year', header: FiscalYearsFormEnum.year},
      {field: 'sort', header: FiscalYearsFormEnum.sort},
      {field: 'enabled', header: FiscalYearsFormEnum.enabled}

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

  validateButtonActions(item: FiscalYearModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.ENABLE), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.DISABLE), 1);
    }
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.fiscalYearsForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.fiscalYearsForm(id)]);
  }

  disable(id: string) {
    this.fiscalYearsHttpService.disable(id).subscribe(fiscalYear => {
      const index = this.items.findIndex(fiscalYear => fiscalYear.id === id);
      this.items[index] = fiscalYear;
    });
  }

  enable(id: string) {
    this.fiscalYearsHttpService.enable(id).subscribe(fiscalYear => {
      const index = this.items.findIndex(fiscalYear => fiscalYear.id === id);
      this.items[index] = fiscalYear;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.fiscalYearsHttpService.remove(id).subscribe((fiscalYear) => {
            this.items = this.items.filter(item => item.id !== fiscalYear.id);
          });
        }
      });
  }

  selectItem(item: FiscalYearModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
