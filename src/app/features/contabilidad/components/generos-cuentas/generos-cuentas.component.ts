import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-generos-cuentas',
    imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, NgFor, NgIf, CommonModule],
    templateUrl: './generos-cuentas.component.html',
    styleUrl: './generos-cuentas.component.css'
})
export class GenerosCuentasComponent {

  generosCuentasArray: any[] = [];
  generoCuentaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedGeneroCuentaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.generoCuentaForm = new FormGroup({
      nombre_genero: new FormControl("", [Validators.required]),
      codigo_genero: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+$")]), // Validador para números enteros
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getGenerosCuenta();
  }
 
  
  getGenerosCuenta() {
    this.http.get('http://localhost:3000/api/GenerosCuentasContables').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.generosCuentasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.generoCuentaForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/GenerosCuentasContables', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getGenerosCuenta();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(generoCuenta: any) {
    this.generoCuentaForm.patchValue(generoCuenta);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedGeneroCuentaId = generoCuenta.id ? generoCuenta.id : generoCuenta.id_genero_cuenta; // Ajustar según el nombre del campo
    if (!this.selectedGeneroCuentaId) {
      this.alertService.error('No se encontró un ID válido para el genero de cuenta seleccionada:',generoCuenta);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedGeneroCuentaId) {
      const formValue = this.generoCuentaForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/GenerosCuentasContables/${this.selectedGeneroCuentaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getGenerosCuenta();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna linea para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.generoCuentaForm.reset({
      nombre_genero: "",
      codigo_genero:0,
      estatus: true
    });
    this.isEditMode = false;
    this.selectedGeneroCuentaId = null; // Limpiar la selección de linea
  }

  // Obtener los datos de localStorage
  getUserFromLocalStorage(): void {
    const storedUserData = localStorage.getItem('loginUser');
    this.usuarioData = storedUserData ? JSON.parse(storedUserData) : null;
    if (this.usuarioData) {
      this.usuarioRol = this.usuarioData.rol;
    }
  }

  
  // Función opcional para eliminar una linea
  onDelete(id: number) {
    this.alertService.confirm('¿Estás seguro?', 'No podrás revertir esta acción', 'Sí, eliminar', 'Cancelar')
    .then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/api/GenerosCuentasContables/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Genero de Cuenta Eliminada', '');
            this.getGenerosCuenta();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
