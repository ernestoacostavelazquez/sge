import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-tipos-persona',
    imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf, CommonModule],
    templateUrl: './tipos-persona.component.html',
    styleUrl: './tipos-persona.component.css'
})
export class TiposPersonaComponent implements OnInit {
  tiposPersonaArray: any[] = [];
  tipoPersonaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedTipoPersonaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.tipoPersonaForm = new FormGroup({
      nombre_tipo: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getTiposPersona();
  }
 
  
  getTiposPersona() {
    this.http.get('http://localhost:3000/api/TiposPersona').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.tiposPersonaArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.tipoPersonaForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/TiposPersona', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getTiposPersona();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(tipoPersona: any) {
    this.tipoPersonaForm.patchValue(tipoPersona);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedTipoPersonaId = tipoPersona.id ? tipoPersona.id : tipoPersona.id_tipo_persona; // Ajustar según el nombre del campo
    if (!this.selectedTipoPersonaId) {
      this.alertService.error('No se encontró un ID válido para el tipo persona seleccionada:', tipoPersona);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedTipoPersonaId) {
      const formValue = this.tipoPersonaForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/TiposPersona/${this.selectedTipoPersonaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getTiposPersona();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun tipo persona para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.tipoPersonaForm.reset({
      nombre_tipo: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedTipoPersonaId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/TiposPersona/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Tipo Persona Eliminado', '');
            this.getTiposPersona();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
