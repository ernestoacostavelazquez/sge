import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-familias',
  imports: [ReactiveFormsModule, HttpClientModule,  NgFor, NgIf, CommonModule],
  templateUrl: './familias.component.html',
  styleUrl: './familias.component.css'
})
export class FamiliasComponent {

  
    
  familiasArray: any[] = [];
  marcasArray: any[] = []; // Array para almacenar géneros de cuentas
  familiaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedFamiliaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.familiaForm = new FormGroup({
      nombre_familia: new FormControl("", [Validators.required]),
      id_marca: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      descripcion_familia: new FormControl("", [Validators.required]), // Validador para números enteros
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getFamilias();
    this.getMarcas(); // Cargar los géneros de cuentas al inicio
  }

  getMarcas() {
    debugger;
    this.http.get('http://localhost:3000/api/Marcas').subscribe((res: any) => {
      debugger;
      if (Array.isArray(res.data)) {
        this.marcasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
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

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.familiaForm.value;
    formValue.id_marca = parseInt(formValue.id_marca, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Familias', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getFamilias();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(familia: any) {
    this.familiaForm.patchValue({
      nombre_familia: familia.nombre_familia,
      id_marca:  familia.marca?.id_marca || 0,  // Set el id del género correspondiente
      descripcion_familia: familia.descripcion_familia,
      estatus: familia.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedFamiliaId = familia.id ? familia.id : familia.id_familia; // Ajustar según el nombre del campo
    if (!this.selectedFamiliaId) {
      this.alertService.error('No se encontró un ID válido para la familia seleccionada:', familia);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedFamiliaId) {
      const formValue = this.familiaForm.value;
      formValue.id_marca = parseInt(formValue.id_marca, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Familias/${this.selectedFamiliaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getFamilias();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna familia para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.familiaForm.reset({
      nombre_familia: "",
      id_marca:"",
      descripción_familia:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedFamiliaId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Familias/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Familia Eliminada', '');
            this.getFamilias();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
