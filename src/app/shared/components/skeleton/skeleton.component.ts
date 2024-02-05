import {Component, Input, OnInit} from '@angular/core';
import {SkeletonEnum} from "@shared/enums";

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {
  protected readonly SkeletonEnum = SkeletonEnum;
  @Input() type = SkeletonEnum.CARD;
  products = ['test1', 'test2', 'test3', 'test4', 'test5'];

  constructor() {
  }

  ngOnInit(): void {
  }
}
