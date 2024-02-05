import { Component, OnInit } from '@angular/core';
import {CoreService} from "@services/core";
import {core} from "@angular/compiler";

@Component({
  selector: 'app-service-unavailable',
  templateUrl: './service-unavailable.component.html',
  styleUrls: ['./service-unavailable.component.css']
})
export class ServiceUnavailableComponent implements OnInit {

  constructor(protected coreService:CoreService) { }

  ngOnInit(): void {
  }

  protected readonly core = core;
}
