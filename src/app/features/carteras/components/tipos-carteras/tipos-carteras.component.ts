import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-tipos-carteras',
    imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf, CommonModule],
    templateUrl: './tipos-carteras.component.html',
    styleUrl: './tipos-carteras.component.css'
})
export class TiposCarterasComponent {

  tiposCarterasArray: any[] = [];
  tipoCarteraForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedTipoCarteraId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.tipoCarteraForm = new FormGroup({
      nombre_tipo_cartera: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getTiposCarteras();
  }
 
  
  getTiposCarteras() {
    this.http.get('http://localhost:3000/api/TiposCartera').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.tiposCarterasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.tipoCarteraForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/TiposCartera', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getTiposCarteras();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(tipoCartera: any) {
    this.tipoCarteraForm.patchValue(tipoCartera);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedTipoCarteraId = tipoCartera.id ? tipoCartera.id : tipoCartera.id_tipo_cartera; // Ajustar según el nombre del campo
    if (!this.selectedTipoCarteraId) {
      this.alertService.error('No se encontró un ID válido para Tipo cartera seleccionada:', tipoCartera);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedTipoCarteraId) {
      const formValue = this.tipoCarteraForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/TiposCartera/${this.selectedTipoCarteraId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getTiposCarteras();
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
    this.tipoCarteraForm.reset({
      nombre_tipo_cartera: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedTipoCarteraId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/TiposCartera/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Tipos Cartera Eliminada', '');
            this.getTiposCarteras();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
