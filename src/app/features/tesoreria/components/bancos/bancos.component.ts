import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-bancos',
    imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, NgFor, NgIf, CommonModule],
    templateUrl: './bancos.component.html',
    styleUrl: './bancos.component.css'
})
export class BancosComponent {

  bancosArray: any[] = [];
  bancoForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedBancoId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.bancoForm = new FormGroup({
      nombre_banco: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getBancos();
  }
 
  
  getBancos() {
    this.http.get('http://localhost:3000/api/Bancos').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.bancosArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.bancoForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Bancos', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getBancos();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(banco: any) {
    this.bancoForm.patchValue(banco);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedBancoId = banco.id ? banco.id : banco.id_banco; // Ajustar según el nombre del campo
    if (!this.selectedBancoId) {
      this.alertService.error('No se encontró un ID válido para el banco seleccionado:', banco);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedBancoId) {
      const formValue = this.bancoForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Bancos/${this.selectedBancoId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getBancos();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun banco para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.bancoForm.reset({
      nombre_banco: "",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedBancoId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Bancos/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Banco Eliminado', '');
            this.getBancos();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }


}
