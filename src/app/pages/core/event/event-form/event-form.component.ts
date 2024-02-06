import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PrimeIcons} from "primeng/api";
import {isAfter} from "date-fns";
import {OnExitInterface} from "@shared/interfaces";
import {CatalogueModel, EventModel} from "@models/core";
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  EventsHttpService, EventsService,
  MessageService,
  RoutesService
} from "@services/core";
import {BreadcrumbEnum, CatalogueTypeEnum, SkeletonEnum} from "@shared/enums";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnExitInterface {
  protected readonly PrimeIcons = PrimeIcons;
  protected id: string | null = null;
  protected form: FormGroup;
  protected startedAt: Date = new Date();

  // Foreign Keys
  protected states: CatalogueModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private eventsHttpService: EventsHttpService,
    private eventsService: EventsService,
  ) {
    this.breadcrumbService.setItems([
      {label: this.eventsService.model.routerLabel, routerLink: [this.eventsService.model.routerLink]},
      {label: BreadcrumbEnum.EVENTS, routerLink: [this.routesService.events]},
      {label: BreadcrumbEnum.FORM},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
    }

    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched && this.form.dirty) {
      return await this.messageService.questionOnExit().then((result: { isConfirmed: any; }) => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadStates();

    if (this.id) {
      this.get();
    }

    this.startedAtField.valueChanges.subscribe((value: string | number | Date) => {
      this.startedAt = new Date(value);
      if (isAfter(this.startedAt, new Date(this.endedAtField.value))) {
        this.endedAtField.setValue(this.startedAt);
      }
    });
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      schoolPeriod: [null, []],
      isVisible: [true, [Validators.required]],
      state: [null, [Validators.required]],
      description: [null, [Validators.required]],
      startedAt: [null, [Validators.required]],
      endedAt: [null, [Validators.required]],
      order: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id) {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields;
    }
  }

  back(): void {
    this.router.navigate([this.routesService.events]);
  }

  /** Actions **/
  create(item: EventModel): void {
    this.eventsHttpService.create(this.eventsService.model.entity.id, item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  update(item: EventModel): void {
    this.eventsHttpService.update(this.id!, item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  /** Load Data **/
  get(): void {
    this.eventsHttpService.findOne(this.id!).subscribe((item: { [key: string]: any; }) => {
      this.form.patchValue(item);
    });
  }

  loadStates(): void {
    this.states = this.cataloguesHttpService.findByType(CatalogueTypeEnum.TYPE_SCHOOL);
  }

  /** Form Getters **/
  get isVisibleField(): AbstractControl {
    return this.form.controls['isVisible'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get schoolPeriodField(): AbstractControl {
    return this.form.controls['schoolPeriod'];
  }

  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }

  get stateField(): AbstractControl {
    return this.form.controls['state'];
  }

  get startedAtField(): AbstractControl {
    return this.form.controls['startedAt'];
  }

  get endedAtField(): AbstractControl {
    return this.form.controls['endedAt'];
  }

  get orderField(): AbstractControl {
    return this.form.controls['order'];
  }

  protected readonly SkeletonEnum = SkeletonEnum;
}
