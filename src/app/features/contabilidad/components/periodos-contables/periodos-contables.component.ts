// periodos-contables.components.ts
import { CommonModule,  NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-periodos-contables',
    imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf, CommonModule],
    templateUrl: './periodos-contables.component.html',
    styleUrl: './periodos-contables.component.css'
})
export class PeriodosContablesComponent {
  
  periodosArray: any[] = [];
  periodoForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedPeriodoId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.periodoForm = new FormGroup({
      periodo: new FormControl("", [Validators.required]),
      fecha_inicio: new FormControl("", [Validators.required]),
      fecha_fin: new FormControl("", [Validators.required]),
      estado: new FormControl("Abierto", [Validators.required, Validators.pattern(/^(Abierto|Cerrado)$/)]),
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getPeriodos();
  }
 
  
  getPeriodos() {
    this.http.get('http://localhost:3000/api/PeriodosContables').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.periodosArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para formatear el periodo de "yyyymm" a "mes año"
  formatPeriodo(periodo: string): string {
    const year = periodo.slice(0, 4);
    const monthNumber = parseInt(periodo.slice(4), 10);
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `${months[monthNumber - 1]} ${year}`;
  }

 // Función para guardar un nuevo periodo
 onSave() {
  const formValue = this.periodoForm.value;
  formValue.created_by = this.usuarioRol;

  // Convertir el periodo a formato yyyymm eliminando el guion
  formValue.periodo = formValue.periodo.replace('-', '');

  this.http.post('http://localhost:3000/api/PeriodosContables', formValue).subscribe((res: any) => {
    if (res.result) {
      this.alertService.success('Registro Exitoso', '');
      this.getPeriodos();
      this.resetForm(); // Resetear el formulario después de guardar
    } else {
      this.alertService.error('Ooops...', res.message);
    }
  });
}

  // Función para editar un rol
  onEdit(periodo: any) {
    this.periodoForm.patchValue(periodo);  // Usar patchValue para llenar los campos del formulario

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedPeriodoId = periodo.id ? periodo.id : periodo.id_periodo; // Ajustar según el nombre del campo
    if (!this.selectedPeriodoId) {
      this.alertService.error('No se encontró un ID válido para el periodo seleccionado:',periodo);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
   // Función para actualizar un periodo existente
   onUpdate() {
    if (this.selectedPeriodoId) {
      const formValue = this.periodoForm.value;
      formValue.updated_by = this.usuarioRol;

      // Convertir el periodo a formato yyyymm eliminando el guion
      formValue.periodo = formValue.periodo.replace('-', '');

      this.http.put(`http://localhost:3000/api/PeriodosContables/${this.selectedPeriodoId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getPeriodos();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      console.error("No se ha seleccionado ninguna línea para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.periodoForm.reset({
      periodo: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: "Abierto",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedPeriodoId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/PeriodosContables/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Perido Eliminado', '');
            this.getPeriodos();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
