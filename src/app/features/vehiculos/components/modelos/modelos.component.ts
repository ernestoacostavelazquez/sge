import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-modelos',
    imports: [ReactiveFormsModule, HttpClientModule,  NgFor, NgIf, CommonModule],
    templateUrl: './modelos.component.html',
    styleUrl: './modelos.component.css'
})
export class ModelosComponent {

  modelosArray: any[] = [];
  familiasArray: any[] = []; // Array para almacenar géneros de cuentas
  modeloForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedModeloId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.modeloForm = new FormGroup({
      nombre_modelo: new FormControl("", [Validators.required]),
      id_familia: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      descripcion_modelo: new FormControl("", [Validators.required]), // Validador para números enteros
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getModelos();
    this.getFamilias(); // Cargar los géneros de cuentas al inicio
  }

  getFamilias() {
    this.http.get('http://localhost:3000/api/Familias').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.familiasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }
  
 
  
  getModelos() {
    this.http.get('http://localhost:3000/api/Modelos').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.modelosArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.modeloForm.value;
    formValue.id_familia = parseInt(formValue.id_familia, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Modelos', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getModelos();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(modelo: any) {
    this.modeloForm.patchValue({
      nombre_modelo: modelo.nombre_modelo,
      id_familia:  modelo.familia?.id_familia || 0,  // Set el id del género correspondiente
      descripcion_modelo: modelo.descripcion_modelo,
      estatus: modelo.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedModeloId = modelo.id ? modelo.id : modelo.id_modelo; // Ajustar según el nombre del campo
    if (!this.selectedModeloId) {
      this.alertService.error('No se encontró un ID válido para el modelo seleccionado:', modelo);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedModeloId) {
      const formValue = this.modeloForm.value;
      formValue.id_familia = parseInt(formValue.id_familia, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Modelos/${this.selectedModeloId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getModelos();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun modelo para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.modeloForm.reset({
      nombre_modelo: "",
      id_familia:"",
      descripcion_modelo:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedModeloId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Modelos/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Modelo Eliminado', '');
            this.getModelos();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
  
}
