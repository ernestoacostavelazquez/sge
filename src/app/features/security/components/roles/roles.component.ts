import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ReactiveFormsModule,JsonPipe,HttpClientModule,NgFor,NgIf],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

  rolesArray: any[] = [];
  rolForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedRoleId: number | null = null; // Variable para almacenar el ID del rol seleccionado

  usuarioData: any = null;
  usuarioRol: string = '';

  constructor(private http: HttpClient, private alertService: AlertService) {
    this.rolForm = new FormGroup({
      nombre_rol: new FormControl("", [Validators.required]),
      descripcion: new FormControl(""),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.http.get('http://localhost:3000/api/Roles').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.rolesArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.message);
      }
    });
  }

  // Función para guardar un nuevo rol
  onSave() {
    const formValue = this.rolForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Roles', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getRoles();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(rol: any) {
    this.rolForm.patchValue(rol);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el rol tiene un campo 'id' o 'id_rol'
    this.selectedRoleId = rol.id ? rol.id : rol.id_rol; // Ajustar según el nombre del campo
    if (!this.selectedRoleId) {
      this.alertService.error('No se encontró un ID válido para el rol seleccionado:', rol);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar un rol existente
  onUpdate() {
    console.log(this.selectedRoleId);
    debugger;
    if (this.selectedRoleId) {
      const formValue = this.rolForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Roles/${this.selectedRoleId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getRoles();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningún rol para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.rolForm.reset({
      nombre_rol: "",
      descripcion: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedRoleId = null; // Limpiar la selección de rol
  }

  // Obtener los datos de localStorage
  getUserFromLocalStorage(): void {
    const storedUserData = localStorage.getItem('loginUser');
    this.usuarioData = storedUserData ? JSON.parse(storedUserData) : null;
    if (this.usuarioData) {
      this.usuarioRol = this.usuarioData.rol;
    }
  }

  // Función opcional para eliminar un rol
  onDelete(id: number) {
    this.alertService.confirm('¿Estás seguro?', 'No podrás revertir esta acción', 'Sí, eliminar', 'Cancelar')
    .then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/api/Roles/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Rol Eliminado', '');
            this.getRoles();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }

}
