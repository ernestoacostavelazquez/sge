import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-almacenes',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,JsonPipe,NgFor,NgIf, CommonModule],
  templateUrl: './almacenes.component.html',
  styleUrl: './almacenes.component.css'
})
export class AlmacenesComponent implements OnInit {
 
  almacenesArray: any[] = [];
  almacenForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedAlmacenId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.almacenForm = new FormGroup({
      nombre: new FormControl("", [Validators.required]),
      descripcion: new FormControl(""),
      direccion: new FormControl(""),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getAlmacenes();
  }
 
  
  getAlmacenes() {
    this.http.get('http://localhost:3000/api/Almacenes').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.almacenesArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.almacenForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Almacenes', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getAlmacenes();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(almacen: any) {
    this.almacenForm.patchValue(almacen);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_almacen'
    this.selectedAlmacenId = almacen.id ? almacen.id : almacen.id_almacen; // Ajustar según el nombre del campo
    if (!this.selectedAlmacenId) {
      this.alertService.error('No se encontró un ID válido para el rol seleccionado:', almacen);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedAlmacenId) {
      const formValue = this.almacenForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Almacenes/${this.selectedAlmacenId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getAlmacenes();
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
    this.almacenForm.reset({
      nombre: "",
      descripcion:"",
      direccion:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedAlmacenId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Almacenes/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Almacem Eliminado', '');
            this.getAlmacenes();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
