import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {MenuItem, PrimeIcons} from "primeng/api";
import {ColumnModel, PaginatorModel, PoaModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService, PoasHttpService, RoutesService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum, PoasFormEnum, RoutesEnum, TableEnum
} from "@shared/enums";

@Component({
  selector: 'app-poa-list',
  templateUrl: './poa-list.component.html',
  styleUrl: './poa-list.component.scss'
})
export class PoaListComponent {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  protected readonly TableEnum = TableEnum;

  protected paginator: PaginatorModel;

  protected buttonActions: MenuItem[] = this.buildButtonActions;
  protected isButtonActions: boolean = false;

  protected columns: ColumnModel[] = this.buildColumns;

  protected search: FormControl = new FormControl('');

  protected selectedItem!: PoaModel;
  protected selectedItems: PoaModel[] = [];
  protected items: PoaModel[] = [];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly coreService: CoreService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly poasHttpService: PoasHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.POAS}]);

    this.paginator = this.coreService.paginator;
  }

  ngOnInit() {
    this.checkValueChanges();
    this.findPoas();
  }

  checkValueChanges() {
    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findPoas();
    });
  }

  findPoas(page: number = 0) {
    this.poasHttpService.findPoas(page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'activity', header: PoasFormEnum.activity},
      {field: 'budgetItem', header: PoasFormEnum.budgetItem},
      {field: 'fundingSource', header: PoasFormEnum.fundingSource},
      {field: 'expenseType', header: PoasFormEnum.expenseType},
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
    ];
  }

  redirectCreateForm() {
    this.router.navigate([this.routesService.poasForm(RoutesEnum.NEW)]);
  }

  redirectEditForm(id: string) {
    this.router.navigate([this.routesService.poasForm(id)]);
  }

  disable(id: string) {
    this.poasHttpService.disable(id).subscribe(poa => {
      const index = this.items.findIndex(poa => poa.id === id);
      this.items[index] = poa;
    });
  }

  enable(id: string) {
    this.poasHttpService.enable(id).subscribe(poa => {
      const index = this.items.findIndex(poa => poa.id === id);
      this.items[index] = poa;
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.poasHttpService.remove(id).subscribe((poa) => {
            this.items = this.items.filter(item => item.id !== poa.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  paginate(event: any) {
    this.findPoas(event.page);
  }

  selectItem(item: PoaModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
  }
}
