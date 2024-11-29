import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AlertService } from '../../../../shared/services/alert.service';


@Component({
    selector: 'app-lineas',
    imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf, CommonModule],
    templateUrl: './lineas.component.html',
    styleUrl: './lineas.component.css'
})


export class LineasComponent implements OnInit  {

  lineasArray: any[] = [];
  lineaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedLineaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.lineaForm = new FormGroup({
      nombre: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getLineas();
  }
 
  
  getLineas() {
    this.http.get('http://localhost:3000/api/Lineas').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.lineasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.lineaForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Lineas', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getLineas();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(linea: any) {
    this.lineaForm.patchValue(linea);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedLineaId = linea.id ? linea.id : linea.id_linea; // Ajustar según el nombre del campo
    if (!this.selectedLineaId) {
      this.alertService.error('No se encontró un ID válido para la linea seleccionada:', linea);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedLineaId) {
      const formValue = this.lineaForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Lineas/${this.selectedLineaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getLineas();
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
    this.lineaForm.reset({
      nombre: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedLineaId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Lineas/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Linea Eliminada', '');
            this.getLineas();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
