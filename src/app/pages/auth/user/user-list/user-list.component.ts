import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from '@angular/router';

import {MenuItem, PrimeIcons} from "primeng/api";

import {UserModel} from '@models/auth';
import {ColumnModel, PaginatorModel} from '@models/core';
import {AuthService, UsersHttpService} from '@services/auth';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  IdButtonActionEnum,
  LabelButtonActionEnum
} from "@shared/enums";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
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

  protected selectedItem!: UserModel;
  protected selectedItems: UserModel[] = [];
  protected items: UserModel[] = [];

  constructor(
    protected readonly authService: AuthService,
    protected readonly coreService: CoreService,
    private readonly breadcrumbService: BreadcrumbService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly usersHttpService: UsersHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.USERS}]);

    this.paginator = this.coreService.paginator;

    this.search.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.findUsers();
    });
  }

  ngOnInit() {
    this.findUsers();
  }

  findUsers(page: number = 0) {
    this.usersHttpService.findUsers(page, this.search.value)
      .subscribe((response) => {
        this.paginator = response.pagination!;
        this.items = response.data;
      });
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'username', header: 'Usuario'},
      {field: 'lastname', header: 'Apellidos'},
      {field: 'name', header: 'Nombres'},
      {field: 'email', header: 'Correo'},
      {field: 'roles', header: 'Roles'},
      {field: 'suspendedAt', header: 'Estado'}
    ];
  }

  /** Button Actions**/
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
    this.router.navigate(['/admin/users', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/admin/users', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.usersHttpService.remove(id).subscribe((user) => {
            this.items = this.items.filter(item => item.id !== user.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.usersHttpService.removeAll(this.selectedItems).subscribe((users) => {
          this.selectedItems.forEach(userDeleted => {
            this.items = this.items.filter(user => user.id !== userDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedItems = [];
        });
      }
    });
  }

  suspend(id: string) {
    this.usersHttpService.suspend(id).subscribe(user => {
      const index = this.items.findIndex(user => user.id === id);
      this.items[index] = user;
    });
  }

  reactivate(id: string) {
    this.usersHttpService.reactivate(id).subscribe(user => {
      const index = this.items.findIndex(user => user.id === id);
      this.items[index] = user;
    });
  }

  validateButtonActions(item: UserModel): void {
    this.buttonActions = this.buildButtonActions;

    if (item.suspendedAt) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.SUSPEND), 1);
    }

    if (!item.suspendedAt) {
      this.buttonActions.splice(this.buttonActions.findIndex(actionButton => actionButton.id === IdButtonActionEnum.REACTIVATE), 1);
    }
  }

  paginate(event: any) {
    this.findUsers(event.page);
  }

  selectItem(item: UserModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    this.validateButtonActions(item);
  }
}
