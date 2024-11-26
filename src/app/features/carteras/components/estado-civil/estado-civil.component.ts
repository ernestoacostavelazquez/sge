import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-estado-civil',
    imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, NgFor, NgIf, CommonModule],
    templateUrl: './estado-civil.component.html',
    styleUrl: './estado-civil.component.css'
})
export class EstadoCivilComponent implements OnInit{
 
  estadosCivilArray: any[] = [];
  estadoCivilForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedEstadosCivilId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.estadoCivilForm = new FormGroup({
      nombre_estado: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getEstadosCivil();
  }
 
  
  getEstadosCivil() {
    this.http.get('http://localhost:3000/api/EstadosCivil').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.estadosCivilArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.estadoCivilForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/EstadosCivil', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getEstadosCivil();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(estadoCivil: any) {
    this.estadoCivilForm.patchValue(estadoCivil);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedEstadosCivilId = estadoCivil.id ? estadoCivil.id : estadoCivil.id_estado_civil; // Ajustar según el nombre del campo
    if (!this.selectedEstadosCivilId) {
      this.alertService.error('No se encontró un ID válido para el Estado Civil seleccionado:', estadoCivil);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedEstadosCivilId) {
      const formValue = this.estadoCivilForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/EstadosCivil/${this.selectedEstadosCivilId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getEstadosCivil();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun Estado Civil para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.estadoCivilForm.reset({
      nombre_estado: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedEstadosCivilId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/EstadosCivil/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Estado Civil Eliminado', '');
            this.getEstadosCivil();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
