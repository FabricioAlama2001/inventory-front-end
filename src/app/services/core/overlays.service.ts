import {Injectable} from '@angular/core';
import { PrimeIcons} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class OverlaysService {

  constructor() {
  }

  get deleteConfirmPopup() {
    return {
      message: '¿Está seguro de eliminar?',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      acceptLabel: 'Si, eliminar',
      rejectLabel: 'Cancelar'
    }
  }
}
