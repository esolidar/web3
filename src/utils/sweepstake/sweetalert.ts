import Swal from 'sweetalert2';

export const sweetAlertSuccess = (title: string, message: string) => {
  Swal.fire({
    title,
    text: message,
    icon: 'success',
    showConfirmButton: true,
    confirmButtonText: 'Ok',
  });
};

export const sweetAlertError = (title: string, message: string) => {
  Swal.fire({
    title,
    text: message,
    icon: 'error',
    showConfirmButton: true,
    confirmButtonText: 'Ok',
  });
};

export const SwalQuestion = (title: string, message: string) =>
  Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then(result => {
    if (result.isConfirmed) return true;
    return false;
  });

export const SwalLoading = (title: string, message: string) =>
  Swal.fire({
    title,
    html: message,
    timerProgressBar: true,
  });
