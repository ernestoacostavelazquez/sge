import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-canales-venta',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,JsonPipe,NgFor,NgIf, CommonModule],
  templateUrl: './canales-venta.component.html',
  styleUrl: './canales-venta.component.css'
})
export class CanalesVentaComponent {

  canalesVentaArray: any[] = [];
  canalVentaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedCanalVentaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.canalVentaForm = new FormGroup({
      nombre_canal: new FormControl("", [Validators.required]),
      descripcion_canal: new FormControl("", [Validators.required]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getCanalesVenta();
  }
 
  
  getCanalesVenta() {
    this.http.get('http://localhost:3000/api/CanalesVenta').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.canalesVentaArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.canalVentaForm.value;
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/CanalesVenta', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getCanalesVenta();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(canalVenta: any) {
    this.canalVentaForm.patchValue(canalVenta);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_unidad'
    this.selectedCanalVentaId = canalVenta.id ? canalVenta.id : canalVenta.id_canal_venta; // Ajustar según el nombre del campo
    if (!this.selectedCanalVentaId) {
      this.alertService.error('No se encontró un ID válido para canal de venta seleccionado:', canalVenta);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedCanalVentaId) {
      const formValue = this.canalVentaForm.value;
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/CanalesVenta/${this.selectedCanalVentaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getCanalesVenta();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna canal de venta para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.canalVentaForm.reset({
      nombre_canal: "",
      descripcion_canal:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedCanalVentaId = null; // Limpiar la selección de la unidad de medida
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
        this.http.delete(`http://localhost:3000/api/CanalesVenta/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Canal de Venta Eliminado', '');
            this.getCanalesVenta();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }

}
