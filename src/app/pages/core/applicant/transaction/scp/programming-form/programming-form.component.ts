import {Component, inject, Input, OnInit} from '@angular/core';
import {OnExitInterface} from "@shared/interfaces";
import {Observable} from "rxjs";
import {UrlTree} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService, SubactivitiesHttpService} from "@services/core";
import {AuthService} from "@services/auth";
import {TreeNode} from "primeng/api";
import {SubactivityModel, TransactionModel} from "@models/core";

@Component({
  selector: 'app-programming-form',
  templateUrl: './programming-form.component.html',
  styleUrl: './programming-form.component.scss'
})
export class ProgrammingFormComponent implements OnInit, OnExitInterface {
  @Input({required: true}) subActivityId!: string;
  protected form: FormGroup;
  private saving: boolean = true;
  protected formErrors: string[] = [];
  protected transaction!: TransactionModel;
  protected subactivity!: SubactivityModel;

  private readonly authService = inject(AuthService);
  public readonly messageService = inject(MessageService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly subactivitiesHttpService = inject(SubactivitiesHttpService);

  constructor() {
    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if ((this.form.touched || this.form.dirty) && this.saving) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.findTransactionBySubactivity();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      fiscalYearId: [this.authService.fiscalYear.id, [Validators.required]],
    });
  }

  findTransactionBySubactivity() {
    this.subactivitiesHttpService.findTransactionBySubactivity(this.subActivityId, this.form.value).subscribe(transaction => {
      this.transaction = transaction;
      console.log(transaction);
      if (this.transaction.transactionDetails) {
        this.subactivity = this.transaction.transactionDetails[0].subactivity;
        console.log(this.subactivity);
      }
    });
  }
}
