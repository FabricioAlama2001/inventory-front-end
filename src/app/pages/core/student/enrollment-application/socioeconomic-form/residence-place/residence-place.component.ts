import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators,} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {EnrollmentModel, LocationModel, StudentModel} from '@models/core';
import {
  CataloguesHttpService,
  CoreService,
  LocationsHttpService,
  MessageService,
  StudentsHttpService
} from '@services/core';
import {CatalogueEnrollmentStateEnum} from "@shared/enums";

@Component({
  selector: 'app-residence-place',
  templateUrl: './residence-place.component.html',
  styleUrls: ['./residence-place.component.scss']
})
export class ResidencePlaceComponent {
  @Input() student!: StudentModel;
  @Input() id!: string;
  @Input() enrollment!: EnrollmentModel;
  @Output() next: EventEmitter<StudentModel> = new EventEmitter<StudentModel>();
  @Output() previous: EventEmitter<number> = new EventEmitter<number>();
  @Output() validForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected readonly PrimeIcons = PrimeIcons;
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected countries: LocationModel[] = [];
  protected provinces: LocationModel[] = [];
  protected cantons: LocationModel[] = [];
  protected parishes: LocationModel[] = [];

  constructor(
    private readonly cataloguesHttpService: CataloguesHttpService,
    private readonly locationsHttpService: LocationsHttpService,
    protected readonly coreService: CoreService,
    private readonly formBuilder: FormBuilder,
    protected readonly messageService: MessageService,
    private readonly studentsHttpService: StudentsHttpService
  ) {
    this.form = this.newForm;
    this.applyValidations();
  }

  ngOnInit(): void {
    this.form.patchValue(this.student);

    if (this.enrollment?.enrollmentStates) {
      if (this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REGISTERED ||
        this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REJECTED) { //reviewer
        this.form.enable();
      } else {
        this.form.disable();
      }
    }

    this.loadCountries();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      user: this.newUserForm
    });
  }

  get newUserForm(): FormGroup {
    return this.formBuilder.group({
      residenceAddress: this.newResidenceAddress
    });
  }

  get newResidenceAddress(): FormGroup {
    return this.formBuilder.group({
      country: [null, [Validators.required]],
      province: [null, [Validators.required]],
      canton: [null, [Validators.required]],
      parrish: [null, [Validators.required]],
      nearbyCity: [null],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      mainStreet: [null, [Validators.required]],
      number: [null],
      reference: [null, [Validators.required]],
      secondaryStreet: [null, [Validators.required]]
    });
  }

  applyValidations() {
    this.countryField.valueChanges.subscribe(value => {
      this.loadProvinces(value?.id);
    });

    this.provinceField.valueChanges.subscribe(value => {
      this.loadCantons(value?.id);
    });

    this.cantonField.valueChanges.subscribe(value => {
      this.loadParishes(value?.id);
    });

    this.parrishField.valueChanges.subscribe(value => {
      this.latitudeField.setValue(null);
      this.longitudeField.setValue(null);

      if (value?.latitude && value?.longitude) {
        setTimeout(() => {
          this.latitudeField.patchValue(value.latitude);
          this.longitudeField.patchValue(value.longitude);
        }, 200);
      }
    });
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.update();
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  update() {
    this.studentsHttpService.updateResidencePlace(
      this.id,
      this.form.value
    ).subscribe(() => this.next.emit());
  }

  validateForm() {
    this.formErrors = [];

    if (this.provinceField.errors) this.formErrors.push('Provincia');
    if (this.cantonField.errors) this.formErrors.push('Cantón');
    if (this.parrishField.errors) this.formErrors.push('Parroquia');
    if (this.nearbyCityField.errors) this.formErrors.push('Ciuidad Cercana');
    if (this.latitudeField.errors) this.formErrors.push('Latitud');
    if (this.longitudeField.errors) this.formErrors.push('Longitud');
    if (this.mainStreetField.errors) this.formErrors.push('Calle principal');
    if (this.numberField.errors) this.formErrors.push('Número de casa');
    if (this.referenceField.errors) this.formErrors.push('Referencia');
    if (this.secondaryStreetField.errors) this.formErrors.push('Calle intersección');

    this.formErrors.sort();
    return this.formErrors.length === 0 && this.form.valid;
  }

  loadCountries(): void {
    this.countries = this.locationsHttpService.findCountries();
    this.countries = this.countries.filter(country => country.alpha3Code === 'ECU');
  }

  loadProvinces(countryId: string): void {
    this.provinces = this.locationsHttpService.findProvincesByCountry(countryId);
  }

  loadCantons(provinceId: string): void {
    this.cantons = this.locationsHttpService.findCantonsByProvince(provinceId);
  }

  loadParishes(cantonId: string): void {
    this.parishes = this.locationsHttpService.findParishesByCanton(cantonId);
  }

  get userForm(): FormGroup {
    return this.form.controls['user'] as FormGroup;
  }

  get residenceAddressForm(): FormGroup {
    return this.userForm.controls['residenceAddress'] as FormGroup;
  }

  get countryField(): AbstractControl {
    return this.residenceAddressForm.controls['country'];
  }

  get provinceField(): AbstractControl {
    return this.residenceAddressForm.controls['province'];
  }

  get cantonField(): AbstractControl {
    return this.residenceAddressForm.controls['canton'];
  }

  get parrishField(): AbstractControl {
    return this.residenceAddressForm.controls['parrish'];
  }

  get nearbyCityField(): AbstractControl {
    return this.residenceAddressForm.controls['nearbyCity'];
  }

  get latitudeField(): AbstractControl {
    return this.residenceAddressForm.controls['latitude'];
  }

  get longitudeField(): AbstractControl {
    return this.residenceAddressForm.controls['longitude'];
  }

  get mainStreetField(): AbstractControl {
    return this.residenceAddressForm.controls['mainStreet'];
  }

  get numberField(): AbstractControl {
    return this.residenceAddressForm.controls['number'];
  }

  get referenceField(): AbstractControl {
    return this.residenceAddressForm.controls['reference'];
  }

  get secondaryStreetField(): AbstractControl {
    return this.residenceAddressForm.controls['secondaryStreet'];
  }
}
