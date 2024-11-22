import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-combustibles',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,JsonPipe,NgFor,NgIf, CommonModule],
  templateUrl: './combustibles.component.html',
  styleUrl: './combustibles.component.css'
})
export class CombustiblesComponent {
  combustiblesArray: any[] = [];
  combustibleForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedCombustibleId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.combustibleForm = new FormGroup({
      nombre_combustible: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getCombustibles();
  }
 
  
  getCombustibles() {
    this.http.get('http://localhost:3000/api/Combustibles').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.combustiblesArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.combustibleForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Combustibles', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getCombustibles();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(combustible: any) {
    this.combustibleForm.patchValue(combustible);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedCombustibleId = combustible.id ? combustible.id : combustible.id_combustible; // Ajustar según el nombre del campo
    if (!this.selectedCombustibleId) {
      this.alertService.error('No se encontró un ID válido para la linea seleccionada:',combustible);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedCombustibleId) {
      const formValue = this.combustibleForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Combustibles/${this.selectedCombustibleId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getCombustibles();
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
    this.combustibleForm.reset({
      nombre_combustible: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedCombustibleId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Combustibles/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Linea Eliminada', '');
            this.getCombustibles();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
