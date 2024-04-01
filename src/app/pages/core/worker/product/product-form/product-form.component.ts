import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {PrimeIcons} from "primeng/api";
import { BreadcrumbService, CoreService, MessageService, RoutesService } from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
  RoutesEnum,
  ApplicationStatusFormEnum
} from "@shared/enums";
import {getSlug} from '@shared/helpers';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {

private readonly breadcrumbService = inject(BreadcrumbService); // 
private readonly formBuilder= inject(FormBuilder); //Formulario Reactivos
private readonly router = inject(Router);//Redireccionar
private readonly routesService = inject(RoutesService);//Ruta de la aplicacion
protected readonly coreService = inject(CoreService);//Funcionalidades Generalidades que se utilizan en todos los componente
protected readonly messageService = inject(MessageService);//

//Decorador que agrega funcionalidad- en esta caso de atributo
//Decoradores agregan funcionalidad a tres cosas clases,metodos y atributos
@Input() id!: string;
protected form!: FormGroup;
protected formErrors!: string[];

protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
protected readonly IconButtonActionEnum = IconButtonActionEnum;
protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
protected readonly PrimeIcons = PrimeIcons;
protected readonly SkeletonEnum = SkeletonEnum;

protected helpText!: string;
private saving: boolean = true;


constructor(){

  this.breadcrumbService.setItems([{
    label: BreadcrumbEnum.PRODUCTS,routerLink:[this.routesService.productsList]
  },
  {
    label: BreadcrumbEnum.FORM
  }
]);

}





}
