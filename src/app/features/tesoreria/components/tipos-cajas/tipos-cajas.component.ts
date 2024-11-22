import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-tipos-cajas',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,JsonPipe,NgFor,NgIf, CommonModule],
  templateUrl: './tipos-cajas.component.html',
  styleUrl: './tipos-cajas.component.css'
})
export class TiposCajasComponent {
  tiposCajaArray: any[] = [];
  tipoCajaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedTipoCajaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.tipoCajaForm = new FormGroup({
      nombre_caja: new FormControl("", [Validators.required]),
      descripcion_caja: new FormControl(""),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getTiposCaja();
  }
 
  
  getTiposCaja() {
    this.http.get('http://localhost:3000/api/TiposCaja').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.tiposCajaArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.tipoCajaForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/TiposCaja', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getTiposCaja();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(tipoCaja: any) {
    this.tipoCajaForm.patchValue(tipoCaja);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedTipoCajaId = tipoCaja.id ? tipoCaja.id : tipoCaja.id_tipo_caja; // Ajustar según el nombre del campo
    if (!this.selectedTipoCajaId) {
      this.alertService.error('No se encontró un ID válido para la linea seleccionada:', tipoCaja);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedTipoCajaId) {
      const formValue = this.tipoCajaForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/TiposCaja/${this.selectedTipoCajaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getTiposCaja();
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
    this.tipoCajaForm.reset({
      nombre_caja: "",
      descripcion_caja:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedTipoCajaId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/TiposCaja/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Linea Eliminada', '');
            this.getTiposCaja();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }


}
