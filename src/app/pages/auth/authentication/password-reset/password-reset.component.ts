import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PrimeIcons} from "primeng/api";
import {CustomValidators} from "@shared/validators";
import {AuthHttpService, AuthService} from '@services/auth';
import {CoreService, MessageService, RoutesService} from '@services/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  protected form: FormGroup;
  protected readonly PrimeIcons = PrimeIcons;
  protected isValidTransactionalCode: boolean = false;
  protected isRequestTransactionalCode: boolean = false;

  constructor(
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    private authHttpService: AuthHttpService,
    public messageService: MessageService,
    protected authService: AuthService,
    protected routesService: RoutesService) {
    this.form = this.newForm();
  }

  ngOnInit(): void {

  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      transactionalCode: [null, [Validators.required, Validators.minLength(6)]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: [null, [Validators.required]],
      username: [null, [Validators.required]],
    }, {validators: CustomValidators.passwordMatchValidator});
  }

  onSubmit() {
    if (this.form.valid) {
      this.resetPassword();
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetPassword() {
    this.authHttpService.resetPassword(this.form.value).subscribe(() => this.routesService.login());
  }

  requestTransactionalCode() {
    if (this.usernameField.valid) {
      this.isRequestTransactionalCode = false;
      this.transactionalCodeField.reset();
      this.authHttpService.requestTransactionalCode(this.usernameField.value).subscribe(
        () => this.isRequestTransactionalCode = true);
    } else {
      this.usernameField.markAsTouched();
    }
  }

  verifyTransactionalCode() {
    if (this.usernameField.valid) {
      this.isValidTransactionalCode = false;
      this.authHttpService.verifyTransactionalCode(this.transactionalCodeField.value, this.usernameField.value).subscribe(
        () => this.isValidTransactionalCode = true);
    } else {
      this.transactionalCodeField.markAsTouched();
    }
  }

  get usernameField() {
    return this.form.controls['username'];
  }

  get transactionalCodeField() {
    return this.form.controls['transactionalCode'];
  }

  get newPasswordField() {
    return this.form.controls['newPassword'];
  }

  get passwordConfirmationField() {
    return this.form.controls['passwordConfirmation'];
  }
}
