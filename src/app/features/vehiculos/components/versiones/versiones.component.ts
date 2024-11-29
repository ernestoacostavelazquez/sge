import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-versiones',
    imports: [ReactiveFormsModule, HttpClientModule,  NgFor, NgIf, CommonModule],
    templateUrl: './versiones.component.html',
    styleUrl: './versiones.component.css'
})
export class VersionesComponent {

      
  versionesArray: any[] = [];
  modelosArray: any[] = []; // Array para almacenar géneros de cuentas
  versionForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedVersionId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.versionForm = new FormGroup({
      nombre_version: new FormControl("", [Validators.required]),
      id_modelo: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      descripcion_version: new FormControl("", [Validators.required]), // Validador para números enteros
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getVersiones();
    this.getModelos(); // Cargar los géneros de cuentas al inicio
  }

  getModelos() {
    debugger;
    this.http.get('http://localhost:3000/api/Modelos').subscribe((res: any) => {
        debugger;
      if (Array.isArray(res.data)) {
        this.modelosArray = res.data;
        debugger;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }
  
 
  
  getVersiones() {
    this.http.get('http://localhost:3000/api/Versiones').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.versionesArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.versionForm.value;
    formValue.id_modelo = parseInt(formValue.id_modelo, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Versiones', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getVersiones();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(version: any) {
    this.versionForm.patchValue({
      nombre_version: version.nombre_version,
      id_modelo:  version.modelo?.id_modelo || 0,  // Set el id del género correspondiente
      descripcion_version: version.descripcion_version,
      estatus: version.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedVersionId = version.id ? version.id : version.id_version; // Ajustar según el nombre del campo
    if (!this.selectedVersionId) {
      this.alertService.error('No se encontró un ID válido para la versión seleccionada:', version);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedVersionId) {
      const formValue = this.versionForm.value;
      formValue.id_modelo = parseInt(formValue.id_modelo, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Versiones/${this.selectedVersionId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getVersiones();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna version para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.versionForm.reset({
      nombre_version: "",
      id_modelo:"",
      descripcion_version:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedVersionId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Versiones/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Version Eliminada', '');
            this.getVersiones();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
  
}
