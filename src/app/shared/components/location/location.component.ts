import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CoreService, MessageService} from "@services/core";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  protected form: FormGroup;

  constructor(private formBuilder: FormBuilder, protected messageService: MessageService, protected coreService: CoreService,) {
    this.form = this.newForm;
  }

  get newForm() {
    return this.formBuilder.group({
      id: [null],
      country: [null],
      province: [null],
      canton: [null],
      parrish: [null],
    })
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.idField.value) {
        // this.update(this.form.value);
      } else {
        // this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields;
    }
  }

  get idField() {
    return this.form.controls['id'];
  }

  get countryField() {
    return this.form.controls['country'];
  }

  get provinceField() {
    return this.form.controls['province'];
  }

  get cantonField() {
    return this.form.controls['canton'];
  }

  get parrishField() {
    return this.form.controls['parrish'];
  }
}
