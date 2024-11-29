import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-colores-internos',
    imports: [ReactiveFormsModule, HttpClientModule,  NgFor, NgIf, CommonModule],
    templateUrl: './colores-internos.component.html',
    styleUrl: './colores-internos.component.css'
})
export class ColoresInternosComponent {

 
        
  coloresIntArray: any[] = [];
  coloresArray: any[] = []; // Array para almacenar géneros de cuentas
  colorIntForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedColorIntId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.colorIntForm = new FormGroup({
      nombre_color_interior: new FormControl("", [Validators.required]),
      id_color: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getColoresInternos();
    this.getColores(); // Cargar los géneros de cuentas al inicio
  }

  getColores() {
    this.http.get('http://localhost:3000/api/Colores').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.coloresArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }
  
 
  
  getColoresInternos() {
    this.http.get('http://localhost:3000/api/ColoresInteriores').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.coloresIntArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.colorIntForm.value;
    formValue.id_color = parseInt(formValue.id_color, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/ColoresInteriores', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getColoresInternos();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(colorInt: any) {
    this.colorIntForm.patchValue({
      nombre_color_interior: colorInt.nombre_color_interior,
      id_color:  colorInt.colore?.id_color || 0,  // Set el id del género correspondiente
      estatus: colorInt.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedColorIntId = colorInt.id ? colorInt.id : colorInt.id_color_interior; // Ajustar según el nombre del campo
    if (!this.selectedColorIntId) {
      this.alertService.error('No se encontró un ID válido para el color interno seleccionado:', colorInt);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedColorIntId) {
      const formValue = this.colorIntForm.value;
      formValue.id_color = parseInt(formValue.id_color, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/ColoresInteriores/${this.selectedColorIntId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getColoresInternos();
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
    this.colorIntForm.reset({
      nombre_color_interior: "",
      id_color:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedColorIntId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/ColoresInteriores/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Color Interno Eliminado', '');
            this.getColoresInternos();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }


}
