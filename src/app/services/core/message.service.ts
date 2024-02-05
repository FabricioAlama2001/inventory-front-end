import {Injectable} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {default as Swal} from 'sweetalert2';
import {PaginatorModel} from '@models/core';
import {ServerResponse} from '@models/http-response';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() {
  }

  error(error: ServerResponse) {
    if (error.statusCode === 422) {
      // const fields = Object.values(error.message).toString().split('.,');
      const fields = error.message;

      let html = '<ul>';
      for (let i = 0; i < fields.length; i++) {
        html += `<li class="pi pi-times"> ${fields[i]}.</li>`;
      }
      html += '</ul>';

      return Swal.fire({
        title: error.error,
        html,
        icon: 'error'
      });
    }

    return Swal.fire({
      title: error.error,
      text: error.message,
      icon: 'error'
    });
  }

  success(serverResponse: ServerResponse) {
    return Swal.fire({
      title: serverResponse.title,
      text: serverResponse.message,
      icon: 'success'
    });
  }

  successCustom(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'info'
    });
  }

  errorCustom(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'error'
    });
  }

  errorsFields(errors: string[] = []) {
    let html = '<ul>';
    for (let i = 0; i < errors.length; i++) {
      html += `<li>${errors[i]}</li>`;
    }
    html += '</ul>';

    return Swal.fire({
      title: 'Revise los campos',
      html,
      icon: 'error'
    });
  }

  questionDelete(title = '¿Está seguro de eliminar?', text = 'No podrá recuperar esta información!') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="pi pi-trash"> Si, eliminar</i>',
      cancelButtonText: 'Cancelar'
    });
  }

  questionOnExit(title = '¿Está seguro de salir?', text = 'Se perderá la información que no haya guardado!') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="pi pi-sign-out"> Si, salir</i>'
    });
  }

  questionVersion(version = '') {
    return Swal.fire({
      title: `Existe una nueva actualización \n V ${version}`,
      text: 'Antes de actualizar, guarde lo que esté haciendo!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#689F38',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="pi pi-sync"> Actualizar</i>',
      cancelButtonText: 'Cancelar'
    });
  }

  questionCustom(title :string, text :string) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="pi pi-check-circle"> Si</i>',
      cancelButtonText: 'Cancelar'
    });
  }

  get requiredFields(): string {
    return `Todos los campos con <b class="p-error">*</b> son obligatorios.`;
  }

  get fieldRequired(): string {
    return 'El campo es obligatorio.';
  }

  get fieldEmail(): string {
    return 'Correo electrónico no es válido.';
  }

  get fieldWeb(): string {
    return 'Página web no válida.';
  }

  get fieldNumber(): string {
    return 'El campo solo debe contener números.';
  }

  fieldMinLength(errors: ValidationErrors) {
    return `Debe contener como mínimo ${errors['minlength']['requiredLength']} caracteres.`;
  }

  fieldMaxLength(errors: ValidationErrors): string {
    return `Debe contener como máximo de caracteres ${errors['maxlength']['requiredLength']}.`;
  }

  fieldMin(errors: ValidationErrors) {
    return `Número mínimo permitido es ${errors['min']['min']}.`;
  }

  fieldMax(errors: ValidationErrors): string {
    return `Número maximo permitido es ${errors['max']['max']}.`;
  }

  get fieldPattern() {
    return `No cumple con el formato.`;
  }

  get fieldIdentification() {
    return `No cumple con el formato de una cédula Ecuatoriana.`;
  }

  get fieldNoPasswordMatch(): string {
    return 'Las contraseñas no coinciden.';
  }

  get fieldUserNotAvailable(): string {
    return 'Este usuario ya se encuentra registrado.';
  }

  get fieldUserAvailable(): string {
    return 'Usuario está disponible.';
  }

  get fieldEmailNotAvailable(): string {
    return 'Este correo electrónico no está disponible.';
  }

  get fieldPhoneNotAvailable(): string {
    return 'Este teléfono no está disponible.';
  }

  get fieldDateValid(): string {
    return 'No es una fecha válida.';
  }

  fieldDateMax(errors: ValidationErrors): string {
    return `La fecha ${errors['dateMax']['actualDate']} no puede ser mayor a ${errors['dateMax']['requiredDate']}.`;
  }

  fieldDateMin(errors: ValidationErrors): string {
    return `La fecha ${errors['dateMin']['actualDate']} no puede ser menor a ${errors['dateMin']['requiredDate']}.`;
  }

  paginatorTotalRegisters(totalItems: number): string {
    return 'En total hay ' + (totalItems) + ' registros.';
  }

  get paginatorNoRecordsFound(): string {
    return 'No se encontraron registros.';
  }

  get buttonFormSaveOrUpdate(): string {
    return `Guardar`;
  }

  get buttonFormClose(): string {
    return `Cerrar`;
  }

  get progressBarProcess(): string {
    return `Procesando...`;
  }

  get progressBarSaveOrUpdate(): string {
    return `Guardando...`;
  }

  get progressBarDownload(): string {
    return `Descargando...`;
  }

  get progressBarUpload(): string {
    return `Cargando...`;
  }

  get progressBarLogin(): string {
    return `Ingresando...`;
  }

  get progressBarRequestPasswordReset(): string {
    return `Enviando correo...`;
  }

  get progressBarDelete(): string {
    return `Eliminando...`;
  }

  get messageSuccessDelete(): string {
    return `Se eliminó correctamente`;
  }

  get exceededMaxAttempts(): string {
    return 'Exceeded the maximum number of attempts allowed';
  }
}
