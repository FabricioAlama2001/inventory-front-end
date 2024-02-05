import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UpdateUserDto} from '@models/auth';
import {AuthHttpService, AuthService} from '@services/auth';
import {BreadcrumbService, CataloguesHttpService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {SkeletonEnum} from "@shared/enums";
import {PrimeIcons} from "primeng/api";

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit, OnExitInterface {
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;
  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private authHttpService: AuthHttpService,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    public messageService: MessageService,
  ) {
    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched && this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getUserInformation();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      emailVerifiedAt: [{value: null, disabled: true}],
      phone: [null, []],
      // roles: [['admin'], []],
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.updateUserInformation(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields();
    }
  }

  getUserInformation(): void {
    this.authHttpService.getUserInformation().subscribe((user) => {
        this.form.patchValue(user);
      }
    );
  }

  updateUserInformation(user: UpdateUserDto): void {
    this.authHttpService.updateUserInformation(user).subscribe((user) => {
      this.form.reset(user);
      this.authService.auth = user;
    });
  }

  get emailField(): AbstractControl {
    return this.form.controls['email'];
  }

  get emailVerifiedAtField(): AbstractControl {
    return this.form.controls['emailVerifiedAt'];
  }

  get phoneField(): AbstractControl {
    return this.form.controls['phone'];
  }

  get usernameField(): AbstractControl {
    return this.form.controls['username'];
  }
}
