import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-categorias',
    imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, NgFor, NgIf, CommonModule],
    templateUrl: './categorias.component.html',
    styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit{

  categoriasArray: any[] = [];
  categoriaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedCategoriaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.categoriaForm = new FormGroup({
      nombre_categoria: new FormControl("", [Validators.required]),
      descripcion_categoria: new FormControl(""),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getCategorias();
  }
 
  
  getCategorias() {
    this.http.get('http://localhost:3000/api/Categorias').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.categoriasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.categoriaForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Categorias', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getCategorias();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(categoria: any) {
    this.categoriaForm.patchValue(categoria);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_categorias'
    this.selectedCategoriaId = categoria.id ? categoria.id : categoria.id_categoria; // Ajustar según el nombre del campo
    if (!this.selectedCategoriaId) {
      this.alertService.error('No se encontró un ID válido para la categoria seleccionada:', categoria);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedCategoriaId) {
      const formValue = this.categoriaForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Categorias/${this.selectedCategoriaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getCategorias();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna categoria para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.categoriaForm.reset({
      nombre_categoria: "",
      descripcion_categoria:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedCategoriaId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Categorias/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Categoria Eliminada', '');
            this.getCategorias();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
