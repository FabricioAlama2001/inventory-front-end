import { Component, OnInit, inject } from '@angular/core';
import { CategoriesService } from '@services/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.categoriesService.findAll().subscribe((response) => {
      console.log(response);
    });
  }
}
