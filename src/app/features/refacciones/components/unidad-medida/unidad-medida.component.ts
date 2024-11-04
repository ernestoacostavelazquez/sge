import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';


@Component({
  selector: 'app-unidad-medida',
  standalone: true,
  imports:[ReactiveFormsModule,HttpClientModule,JsonPipe,NgFor,NgIf, CommonModule],
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['./unidad-medida.component.css']
})
export class UnidadMedidaComponent  implements OnInit  {

  unidadesMedidaArray: any[] = [];
  unidadMedidaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedUnidadMedidaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.unidadMedidaForm = new FormGroup({
      nombre: new FormControl("", [Validators.required]),
      descripcion: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getUnidadesMedida();
  }
 
  
  getUnidadesMedida() {
    this.http.get('http://localhost:3000/api/UnidadMedida').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.unidadesMedidaArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.unidadMedidaForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/UnidadMedida', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getUnidadesMedida();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(unidadMedida: any) {
    this.unidadMedidaForm.patchValue(unidadMedida);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_unidad'
    this.selectedUnidadMedidaId = unidadMedida.id ? unidadMedida.id : unidadMedida.id_unidad; // Ajustar según el nombre del campo
    if (!this.selectedUnidadMedidaId) {
      this.alertService.error('No se encontró un ID válido para la unidad de medida seleccionada:', unidadMedida);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedUnidadMedidaId) {
      const formValue = this.unidadMedidaForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/UnidadMedida/${this.selectedUnidadMedidaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getUnidadesMedida();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna unidad de medida para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.unidadMedidaForm.reset({
      nombre: "",
      descripcion:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedUnidadMedidaId = null; // Limpiar la selección de la unidad de medida
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
        this.http.delete(`http://localhost:3000/api/UnidadMedida/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Unidad de Medida Eliminada', '');
            this.getUnidadesMedida();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
  
}
