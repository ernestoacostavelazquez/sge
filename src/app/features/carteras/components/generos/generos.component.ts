import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-generos',
    imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, NgFor, NgIf, CommonModule],
    templateUrl: './generos.component.html',
    styleUrl: './generos.component.css'
})
export class GenerosComponent implements OnInit {

  generosArray: any[] = [];
  generoForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedGeneroId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.generoForm = new FormGroup({
      nombre_genero: new FormControl("", [Validators.required]),
      descripcion: new FormControl(""),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getGeneros();
  }
 
  
  getGeneros() {
    this.http.get('http://localhost:3000/api/Generos').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.generosArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.generoForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Generos', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getGeneros();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(genero: any) {
    this.generoForm.patchValue(genero);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_genero'
    this.selectedGeneroId = genero.id ? genero.id : genero.id_genero; // Ajustar según el nombre del campo
    if (!this.selectedGeneroId) {
      this.alertService.error('No se encontró un ID válido para el Genero seleccionado:', genero);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedGeneroId) {
      const formValue = this.generoForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Generos/${this.selectedGeneroId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getGeneros();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun genero para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.generoForm.reset({
      nombre_genero: "",
      descripcion:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedGeneroId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Generos/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Genero Eliminado', '');
            this.getGeneros();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
