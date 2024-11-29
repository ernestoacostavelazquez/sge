import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-sub-categorias',
    imports: [ReactiveFormsModule, HttpClientModule,  NgFor, NgIf, CommonModule],
    templateUrl: './sub-categorias.component.html',
    styleUrl: './sub-categorias.component.css'
})
export class SubCategoriasComponent {

    
        
  subCategoriasArray: any[] = [];
  categoriasArray: any[] = []; // Array para almacenar géneros de cuentas
  subCategoriaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedSubCategoriaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.subCategoriaForm = new FormGroup({
      nombre_sub_categoria: new FormControl("", [Validators.required]),
      id_categoria: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getSubCategorias();
    this.getCategorias(); // Cargar los géneros de cuentas al inicio
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
  
 
  
  getSubCategorias() {
    this.http.get('http://localhost:3000/api/SubCategorias').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.subCategoriasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.subCategoriaForm.value;
    formValue.id_categoria = parseInt(formValue.id_categoria, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/SubCategorias', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getSubCategorias();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(subCat: any) {
    this.subCategoriaForm.patchValue({
      nombre_sub_categoria: subCat.nombre_sub_categoria,
      id_categoria: subCat.categoria?.id_categoria || 0,  // Set el id del género correspondiente
      estatus: subCat.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedSubCategoriaId = subCat.id ? subCat.id : subCat.id_sub_categoria; // Ajustar según el nombre del campo
    if (!this.selectedSubCategoriaId) {
      this.alertService.error('No se encontró un ID válido para la SubCategoria seleccionada:', subCat);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedSubCategoriaId) {
      const formValue = this.subCategoriaForm.value;
      formValue.id_categoria = parseInt(formValue.id_categoria, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/SubCategorias/${this.selectedSubCategoriaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getSubCategorias();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun color interno para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.subCategoriaForm.reset({
      nombre_sub_categoria: "",
      id_categoria:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedSubCategoriaId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/SubCategorias/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('SubCategoria Eliminada', '');
            this.getSubCategorias();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }

}
