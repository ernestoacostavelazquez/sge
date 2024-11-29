import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-colores-externos',
    imports: [ReactiveFormsModule, HttpClientModule,  NgFor, NgIf, CommonModule],
    templateUrl: './colores-externos.component.html',
    styleUrl: './colores-externos.component.css'
})
export class ColoresExternosComponent {

      
  coloresExtArray: any[] = [];
  coloresArray: any[] = []; // Array para almacenar géneros de cuentas
  colorExtForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedColorExtId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.colorExtForm = new FormGroup({
      nombre_color_exterior: new FormControl("", [Validators.required]),
      id_color: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getColoresExternos();
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
  
 
  
  getColoresExternos() {
    this.http.get('http://localhost:3000/api/ColoresExteriores').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.coloresExtArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.colorExtForm.value;
    formValue.id_color = parseInt(formValue.id_color, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/ColoresExteriores', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getColoresExternos();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(colorExt: any) {
    this.colorExtForm.patchValue({
      nombre_color_exterior: colorExt.nombre_color_exterior,
      id_color:  colorExt.colore?.id_color || 0,  // Set el id del género correspondiente
      estatus: colorExt.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedColorExtId = colorExt.id ? colorExt.id : colorExt.id_color_exterior; // Ajustar según el nombre del campo
    if (!this.selectedColorExtId) {
      this.alertService.error('No se encontró un ID válido para el color exterior seleccionado:', colorExt);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedColorExtId) {
      const formValue = this.colorExtForm.value;
      formValue.id_color = parseInt(formValue.id_color, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/ColoresExteriores/${this.selectedColorExtId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getColoresExternos();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun color exterior para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.colorExtForm.reset({
      nombre_color_exterior: "",
      id_color:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedColorExtId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/ColoresExteriores/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Color Exterior Eliminado', '');
            this.getColoresExternos();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
  
}
