import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  showSuccess(message: string, title: string = 'Succès') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonText: 'OK',
    });
  }

  showError(message: string, title: string = 'Erreur') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK',
    });
  }

  showWarning(message: string, title: string = 'Attention') {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: 'OK',
    });
  }

  showConfirmation(
    message: string,
    title: string = 'Attention !'
  ) {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      reverseButtons: false,
    });
  }

  showAlert(message: string, title: string = 'Information') {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonText: 'OK',
    });
  }
}
