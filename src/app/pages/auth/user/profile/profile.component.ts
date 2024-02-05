import {Component, OnInit} from '@angular/core';
import {BreadcrumbService, MessageService} from '@services/core';
import {BreadcrumbEnum} from "@shared/enums";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.PROFILE}
    ]);
  }

  ngOnInit(): void {
  }

}
