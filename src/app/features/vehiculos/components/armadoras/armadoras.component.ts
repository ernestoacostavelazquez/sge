import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-armadoras',
    imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, NgFor, NgIf, CommonModule],
    templateUrl: './armadoras.component.html',
    styleUrl: './armadoras.component.css'
})
export class ArmadorasComponent {
  
  armadorasArray: any[] = [];
  armadoraForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedArmadoraId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.armadoraForm = new FormGroup({
      nombre_armadora: new FormControl("", [Validators.required]),
      descripcion_armadora: new FormControl(""),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getArmadoras();
  }
 
  
  getArmadoras() {
    this.http.get('http://localhost:3000/api/Armadoras').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.armadorasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.armadoraForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Armadoras', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getArmadoras();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(armadora: any) {
    this.armadoraForm.patchValue(armadora);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedArmadoraId = armadora.id ? armadora.id : armadora.id_armadora; // Ajustar según el nombre del campo
    if (!this.selectedArmadoraId) {
      this.alertService.error('No se encontró un ID válido para la Armadaora seleccionada:', armadora);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedArmadoraId) {
      const formValue = this.armadoraForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Armadoras/${this.selectedArmadoraId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getArmadoras();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna Armadora para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.armadoraForm.reset({
      nombre_armadora: "",
      descripcion_armadora:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedArmadoraId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Armadoras/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Armadora Eliminada', '');
            this.getArmadoras();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
