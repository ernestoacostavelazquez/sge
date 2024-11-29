import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-carteras',
    imports: [ReactiveFormsModule, HttpClientModule,  NgFor, NgIf, CommonModule],
    templateUrl: './carteras.component.html',
    styleUrl: './carteras.component.css'
})
export class CarterasComponent {

  carterasArray: any[] = [];
  tiposCarterasArray: any[] = []; // Array para almacenar géneros de cuentas
  carteraForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedCarteraId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.carteraForm = new FormGroup({
      nombre_cartera: new FormControl("", [Validators.required]),
      id_tipo_cartera: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      descripcion_cartera: new FormControl("", [Validators.required]), // Validador para números enteros
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getCarteras();
    this.getTiposCarteras(); // Cargar los géneros de cuentas al inicio
  }

  getTiposCarteras() {
    debugger;
    this.http.get('http://localhost:3000/api/TiposCartera').subscribe((res: any) => {
        debugger;
      if (Array.isArray(res.data)) {
        this.tiposCarterasArray = res.data;
        debugger;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }
  
 
  
  getCarteras() {
    this.http.get('http://localhost:3000/api/Carteras').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.carterasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.carteraForm.value;
    formValue.id_tipo_cartera = parseInt(formValue.id_tipo_cartera, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Carteras', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getCarteras();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(cartera: any) {
    this.carteraForm.patchValue({
      nombre_cartera: cartera.nombre_cartera,
      id_tipo_cartera: cartera.tipo_cartera?.id_tipo_cartera || 0,  // Set el id del género correspondiente
      descripcion_cartera: cartera.descripcion_cartera,
      estatus: cartera.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedCarteraId = cartera.id ? cartera.id : cartera.id_cartera; // Ajustar según el nombre del campo
    if (!this.selectedCarteraId) {
      this.alertService.error('No se encontró un ID válido para la cartera seleccionada:', cartera);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedCarteraId) {
      const formValue = this.carteraForm.value;
      formValue.id_tipo_cartera = parseInt(formValue.id_tipo_cartera, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Carteras/${this.selectedCarteraId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getCarteras();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna cartera para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.carteraForm.reset({
      nombre_cartera: "",
      id_tipo_cartera:"",
      descripcion_cartera:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedCarteraId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Carteras/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Marca Eliminada', '');
            this.getCarteras();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
  

}
