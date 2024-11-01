import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-paises',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,JsonPipe,NgFor,NgIf, CommonModule],
  templateUrl: './paises.component.html',
  styleUrl: './paises.component.css'
})
export class PaisesComponent implements OnInit {

  paisesArray: any[] = [];
  paisForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedPaisId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';

  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.paisForm = new FormGroup({
      nombre: new FormControl("", [Validators.required]),
      codigo_iso_alpha2: new FormControl("",[Validators.required,Validators.minLength(2)]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getPaises();
  }
 
  
  getPaises() {
    this.http.get('http://localhost:3000/api/Paises').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.paisesArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    debugger;
    const formValue = this.paisForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Paises', formValue).subscribe((res: any) => {
      debugger;
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getPaises();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(pais: any) {
    debugger;
    this.paisForm.patchValue(pais);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedPaisId = pais.id ? pais.id : pais.id_pais; // Ajustar según el nombre del campo
    if (!this.selectedPaisId) {
      this.alertService.error('No se encontró un ID válido para el rol seleccionado:', pais);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    debugger;
    if (this.selectedPaisId) {
      const formValue = this.paisForm.value;
      formValue.updated_by = this.usuarioRol;
      debugger;

      this.http.put(`http://localhost:3000/api/Paises/${this.selectedPaisId}`, formValue).subscribe((res: any) => {
        debugger;
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getPaises();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna linea para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.paisForm.reset({
      nombre: "",
      codigo_iso_alpha2:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedPaisId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Paises/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Pais Eliminado', '');
            this.getPaises();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }

}
