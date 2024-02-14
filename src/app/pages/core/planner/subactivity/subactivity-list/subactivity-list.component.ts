import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Router } from '@angular/router';

import { MenuItem, PrimeIcons } from "primeng/api";

import { ColumnModel, PaginatorModel, SubactivityModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService, SubactivitiesHttpService } from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum
} from "@shared/enums";
import { debounceTime } from "rxjs";

@Component({
  selector: 'app-subactivity-list',
  standalone: true,
  imports: [],
  templateUrl: './subactivity-list.component.html',
  styleUrl: './subactivity-list.component.scss'
})
export class SubactivityListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected paginator: PaginatorModel;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: SubactivityModel;
  protected selectedItems: SubactivityModel[] = [];
  protected items: SubactivityModel[] = [];

  constructor(
    protected readonly coreService: CoreService,
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly subactivitiesHttpService: SubactivitiesHttpService,
  ) {
    this.breadcrumbService.setItems([{ label: BreadcrumbEnum.SUBACTIVITIES }]);

    this.paginator = this.coreService.paginator;

    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findSubactivities();
    });
  }

  ngOnInit() {
    this.findSubactivities();
  }

  findSubactivities(page: number = 0) {
    this.subactivitiesHttpService.findSubactivities(page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      { field: 'name', header: 'Nombre' },
      { field: 'type', header: 'Tipo' },
      { field: 'fiscalYear', header: 'Año fiscal' },
      { field: 'enabled', header: 'Disponible' },
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
        id: IdButtonActionEnum.SUSPEND,
        label: LabelButtonActionEnum.SUSPEND,
        icon: IconButtonActionEnum.SUSPEND,
        command: () => {
          if (this.selectedItem?.id) this.suspend(this.selectedItem.id);
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
    ];
  }

  redirectCreateForm() {
    this.router.navigate(['/planner/subactivities', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/planner/subactivities', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.subactivitiesHttpService.remove(id).subscribe((subactivity) => {
            this.items = this.items.filter(item => item.id !== subactivity.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.subactivitiesHttpService.removeAll(this.selectedItems).subscribe((subactivities) => {
          this.selectedItems.forEach(subactivityDeleted => {
            this.items = this.items.filter(subactivity => subactivity.id !== subactivityDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedItems = [];
        });
      }
    });
  }

  suspend(id: string) {
    this.subactivitiesHttpService.suspend(id).subscribe(subactivity => {
      const index = this.items.findIndex(subactivity => subactivity.id === id);
      this.items[index] = subactivity;
    });
  }

  reactivate(id: string) {
    this.subactivitiesHttpService.reactivate(id).subscribe(subactivity => {
      const index = this.items.findIndex(subactivity => subactivity.id === id);
      this.items[index] = subactivity;
    });
  }

  validateButtonActions(item: SubactivityModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.SUSPEND), 1);
    }

    if (!item.enabled) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.REACTIVATE), 1);
    }
  }

  paginate(event: any) {
    this.findSubactivities(event.page);
  }

  selectItem(item: SubactivityModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
