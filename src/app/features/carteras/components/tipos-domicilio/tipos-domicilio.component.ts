import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-tipos-domicilio',
    imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, NgFor, NgIf, CommonModule],
    templateUrl: './tipos-domicilio.component.html',
    styleUrl: './tipos-domicilio.component.css'
})
export class TiposDomicilioComponent implements OnInit {

  tiposDomiciliosArray: any[] = [];
  tipoDomicilioForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedTipoDomicilioId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.tipoDomicilioForm = new FormGroup({
      nombre_tipo_domicilio: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getTiposDomicilios();
  }
 
  
  getTiposDomicilios() {
    this.http.get('http://localhost:3000/api/TiposDomicilios').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.tiposDomiciliosArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.tipoDomicilioForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/TiposDomicilios', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getTiposDomicilios();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(tipoDomicilio: any) {
    this.tipoDomicilioForm.patchValue(tipoDomicilio);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedTipoDomicilioId = tipoDomicilio.id ? tipoDomicilio.id : tipoDomicilio.id_tipo_domicilio; // Ajustar según el nombre del campo
    if (!this.selectedTipoDomicilioId) {
      this.alertService.error('No se encontró un ID válido para el tipo domicilio seleccionado:', tipoDomicilio);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedTipoDomicilioId) {
      const formValue = this.tipoDomicilioForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/TiposDomicilios/${this.selectedTipoDomicilioId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getTiposDomicilios();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun tipo de domicilio para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.tipoDomicilioForm.reset({
      nombre_tipo_domicilio: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedTipoDomicilioId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/TiposDomicilios/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Tipo de Domicilio Eliminado', '');
            this.getTiposDomicilios();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
