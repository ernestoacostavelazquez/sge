import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-unidades-empaque',
    imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, NgFor, NgIf, CommonModule],
    templateUrl: './unidades-empaque.component.html',
    styleUrl: './unidades-empaque.component.css'
})
export class UnidadesEmpaqueComponent {
  
  unidadesEmpaqueArray: any[] = [];
  unidadEmpaqueForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedUnidadEmpaqueId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.unidadEmpaqueForm = new FormGroup({
      nombre_empaque: new FormControl("", [Validators.required]),
      descripcion_empaque: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getUnidadesEmpaque();
  }
 
  
  getUnidadesEmpaque() {
    this.http.get('http://localhost:3000/api/UnidadesEmpaque').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.unidadesEmpaqueArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.unidadEmpaqueForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/UnidadesEmpaque', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getUnidadesEmpaque();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(unidadEmpaque: any) {
    this.unidadEmpaqueForm.patchValue(unidadEmpaque);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_unidad'
    this.selectedUnidadEmpaqueId = unidadEmpaque.id ? unidadEmpaque.id : unidadEmpaque.id_empaque; // Ajustar según el nombre del campo
    if (!this.selectedUnidadEmpaqueId) {
      this.alertService.error('No se encontró un ID válido para la unidad de empaque seleccionada:', unidadEmpaque);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedUnidadEmpaqueId) {
      const formValue = this.unidadEmpaqueForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/UnidadesEmpaque/${this.selectedUnidadEmpaqueId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getUnidadesEmpaque();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna unidad de empaque para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.unidadEmpaqueForm.reset({
      nombre_empaque: "",
      descripcion_empaque:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedUnidadEmpaqueId = null; // Limpiar la selección de la unidad de medida
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
        this.http.delete(`http://localhost:3000/api/UnidadesEmpaque/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Unidad de Empaque Eliminada', '');
            this.getUnidadesEmpaque();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }

}
