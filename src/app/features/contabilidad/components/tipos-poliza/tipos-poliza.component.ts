import { CommonModule,  NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-tipos-poliza',
    imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf, CommonModule],
    templateUrl: './tipos-poliza.component.html',
    styleUrl: './tipos-poliza.component.css'
})
export class TiposPolizaComponent implements OnInit{

  tiposPolizaArray: any[] = [];
  tipoPolizaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedTipoPoliza: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.tipoPolizaForm = new FormGroup({
      nombre_tipo_poliza: new FormControl("", [Validators.required]),
      abreviatura: new FormControl("", [Validators.required,Validators.minLength(5)]),
      descripcion: new FormControl("", [Validators.required]),      
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getTiposPoliza();
  }
 
  
  getTiposPoliza() {
    this.http.get('http://localhost:3000/api/TiposPoliza').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.tiposPolizaArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.tipoPolizaForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/TiposPoliza', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getTiposPoliza();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(tipoPoliza: any) {
    this.tipoPolizaForm.patchValue(tipoPoliza);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_tipo_poliza'
    this.selectedTipoPoliza = tipoPoliza.id ? tipoPoliza.id : tipoPoliza.id_tipo_poliza; // Ajustar según el nombre del campo
    if (!this.selectedTipoPoliza) {
      this.alertService.error('No se encontró un ID válido para tipo de póliza seleccionada:',tipoPoliza);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedTipoPoliza) {
      const formValue = this.tipoPolizaForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/TiposPoliza/${this.selectedTipoPoliza}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getTiposPoliza();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna tipo de póliza para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.tipoPolizaForm.reset({
      nombre_tipo_poliza: "",
      abreviatura:"",
      descripcion:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedTipoPoliza = null; // Limpiar la selección de linea
  }

  // Obtener los datos de localStorage
  getUserFromLocalStorage(): void {
    const storedUserData = localStorage.getItem('loginUser');
    this.usuarioData = storedUserData ? JSON.parse(storedUserData) : null;
    if (this.usuarioData) {
      this.usuarioRol = this.usuarioData.rol;
    }
  }

  
  // Función opcional para eliminar tipo póliza
  onDelete(id: number) {
    this.alertService.confirm('¿Estás seguro?', 'No podrás revertir esta acción', 'Sí, eliminar', 'Cancelar')
    .then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/api/TiposPoliza/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Tipo de Póliza Eliminada', '');
            this.getTiposPoliza();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
