import {Component, Input, OnInit, inject} from '@angular/core';
import {
  AbstractControl, FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {UserModel} from '@models/auth';
import {TransactionModel} from '@models/core/transaction.model';
import {UsersHttpService} from '@services/auth';
import {
  BreadcrumbService,
  CategoriesHttpService,
  CoreService,
  ExpensesHttpService,
  MessageService,
  ProductsHttpService,
  RoutesService,
} from '@services/core';
import {TransactionsHttpService} from '@services/core/transactions-http.service';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  RoleEnum,
  RoutesEnum,
  SkeletonEnum,
} from '@shared/enums';
import {PrimeIcons} from 'primeng/api';
import {TransactionDetailModel} from "@models/core/transaction-detail.model";
import {format} from "date-fns";
import {computeStartOfLinePositions} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/source_file";

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
})
export class TransactionFormComponent implements OnInit {
  private readonly transactionsHttpService = inject(TransactionsHttpService);
  private readonly expensesHttpService = inject(ExpensesHttpService);
  private readonly usersHttpService = inject(UsersHttpService);
  private readonly breadcrumbService = inject(BreadcrumbService); //
  private readonly formBuilder = inject(FormBuilder); //Ayuda a crear - Formulario Reactivos
  private readonly router = inject(Router); //Redireccionar
  private readonly routesService = inject(RoutesService); //Ruta de la aplicacion
  protected readonly coreService = inject(CoreService); //Funcionalidades Generalidades que se utilizan en todos los componente
  protected readonly messageService = inject(MessageService); //

  @Input() id!: string;
  protected form!: FormGroup;
  protected formErrors!: string[];
  protected types!: any[];
  protected users!: UserModel[];
  protected clients!: UserModel[];
  protected client!: string;
  protected titleTransactionDetails!: string;

  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;

  protected helpText!: string;
  private saving: boolean = true;
  protected isTransactionForm: boolean = false;

  constructor() {
    this.breadcrumbService.setItems([
      {
        label: BreadcrumbEnum.TRANSACTIONS,
        routerLink: [this.routesService.transactionsList],
      },
      {
        label: BreadcrumbEnum.FORM,
      },
    ]);

    this.form = this.buildForm;

    this.checkValueChanges();
  }

  ngOnInit(): void {
    this.loadTypes();
    this.loadUsers();
    this.loadTransaction();

    if (this.id != RoutesEnum.NEW) {
      this.findTransaction();
    }
  }

  //metodo validación de emulación de foringkey
  loadTypes() {
    const transactionStorage = JSON.parse(localStorage.getItem('transaction')!) as TransactionModel;

    this.types = [transactionStorage.type];
  }

  loadTransaction() {
    const transactionStorage = JSON.parse(localStorage.getItem('transaction')!) as TransactionModel;

    if (transactionStorage) {
      this.form.patchValue(transactionStorage);
      if (!transactionStorage.date) {
        this.dateField.setValue(format(new Date(), 'yyyy-MM-dd'));
      }
    }
  }

  //metodo
  loadUsers() {
    this.usersHttpService.findCatalogues().subscribe((users) => {
      this.users = users.filter((user) =>
        user.roles.some((role) => role.code === RoleEnum.APPROVER)
      );

      if (this.typeField.value && this.typeField.value.type) {
        this.client = 'Proveedor';

        this.clients = users.filter((user) =>
          user.roles.some((role) => role.code === RoleEnum.PROVIDER)
        );
      } else {
        this.client = 'Cliente';

        this.clients = users.filter((user) =>
          user.roles.some((role) => role.code === RoleEnum.CUSTOMER)
        );
      }

      if (this.clients.length === 1) {
        this.clientField.patchValue(this.clients[0]);
      }

      if (this.users.length === 1) {
        this.userField.patchValue(this.users[0]);
      }
    });
  }

  //Este metodo Construir el formulario reactivo
  get buildForm() {
    const transactionStorage = JSON.parse(localStorage.getItem('transaction')!) as TransactionModel;

    return this.formBuilder.group({
      code: [null],
      description: [null, Validators.required],
      date: [null, Validators.required],
      type: [transactionStorage.type, Validators.required],
      user: [null, Validators.required],
      client: [null, Validators.required],
      transactionDetails: [[], Validators.required]
    });
  }

  checkValueChanges() {
    this.typeField.valueChanges.subscribe((value) => {
      this.loadUsers();
      if (value && value.type) {
        this.titleTransactionDetails = 'Ingresos';
      } else {
        this.titleTransactionDetails = 'Egresos';
      }
    });

    this.form.valueChanges.subscribe(value => {
      localStorage.setItem('transaction', JSON.stringify(value));
    });
  }

  findTransaction(): void {
    this.transactionsHttpService.findOne(this.id!).subscribe((data) => {
      this.form.patchValue(data);
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.codeField.errors) {
      this.formErrors.push('Código');
    }

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  back(): void {
    localStorage.removeItem('transaction');
    this.router.navigate([this.routesService.transactionsList]);
  }

  createIncome(payload: TransactionModel): void {
    this.transactionsHttpService
      .create(payload)
      .subscribe((applicationStatus) => {
        this.saving = false;
        this.back();
      });
  }

  createExpenses(payload: TransactionModel): void {
    this.expensesHttpService
      .create(payload)
      .subscribe((applicationStatus) => {
        this.saving = false;
        this.back();
      });
  }

  update(payload: TransactionModel): void {
    this.transactionsHttpService
      .update(this.id!, payload)
      .subscribe((applicationStatus) => {
        this.saving = false;
        this.back();
      });
  }

  onSubmit() {
    this.transactionDetailsField.updateValueAndValidity();

    if (this.validateFormErrors) {
      if (this.id === RoutesEnum.NEW) {
        if (this.typeField.value.type) {
          this.createIncome(this.form.value);
        } else {
          this.createExpenses(this.form.value);
        }
      } else {
        this.update(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  openTransactionForm() {
    this.isTransactionForm = true;
  }

  addTransactionDetail(transactionDetailModel: TransactionDetailModel) {
    const transactionDetails: TransactionDetailModel[] = this.transactionDetailsField.value;
    const index = transactionDetails.findIndex(item => item.product.id == transactionDetailModel.product.id);

    if (index > -1) {
      this.transactionDetailsField.value[index].quantity += transactionDetailModel.quantity;
      this.transactionDetailsField.value[index].observation = transactionDetailModel.observation;
      this.messageService.warningCustom('El producto ya existe', 'Fue actualizado');
    } else {
      this.transactionDetailsField.value.push(transactionDetailModel);
      this.messageService.successCustom('Producto Agregado', 'Correctamente');
    }

    localStorage.setItem('transaction', JSON.stringify(this.form.value));

    //this.isTransactionForm = false;
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }

  get dateField(): AbstractControl {
    return this.form.controls['date'];
  }

  get typeField(): AbstractControl {
    return this.form.controls['type'];
  }

  get userField(): AbstractControl {
    return this.form.controls['user'];
  }

  get clientField(): AbstractControl {
    return this.form.controls['client'];
  }

  get transactionDetailsField(): FormArray {
    return this.form.controls['transactionDetails'] as FormArray;
  }
}
