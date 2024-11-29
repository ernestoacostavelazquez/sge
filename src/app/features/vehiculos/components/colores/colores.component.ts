import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-colores',
    imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf, CommonModule],
    templateUrl: './colores.component.html',
    styleUrl: './colores.component.css'
})
export class ColoresComponent {

    
  coloresArray: any[] = [];
  colorForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedColorId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.colorForm = new FormGroup({
      nombre_color: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getColores();
  }
 
  
  getColores() {
    this.http.get('http://localhost:3000/api/Colores').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.coloresArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.colorForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Colores', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getColores();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(color: any) {
    this.colorForm.patchValue(color);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedColorId = color.id ? color.id : color.id_color; // Ajustar según el nombre del campo
    if (!this.selectedColorId) {
      this.alertService.error('No se encontró un ID válido para el color seleccionado:', color);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedColorId) {
      const formValue = this.colorForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Colores/${this.selectedColorId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getColores();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun color para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.colorForm.reset({
      nombre_color: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedColorId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Colores/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Color Eliminado', '');
            this.getColores();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
