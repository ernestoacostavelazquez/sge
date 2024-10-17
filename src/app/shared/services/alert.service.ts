import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

 
  constructor() { }

  // Método para mostrar una alerta de éxito
  success(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'OK'
    });
  }

  // Método para mostrar una alerta de error
  error(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'OK'
    });
  }

  // Método para mostrar una alerta de confirmación
  confirm(title: string, text: string, confirmButtonText: string, cancelButtonText: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    });
  }
}
