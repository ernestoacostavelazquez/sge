// catalogo-cuentas.component.ts
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-catalogo-cuentas',
    imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf, CommonModule],
    templateUrl: './catalogo-cuentas.component.html',
    styleUrl: './catalogo-cuentas.component.css'
})
export class CatalogoCuentasComponent {

  cuentasArray: any[] = [];
  gruposArray: any[] = [];
  cuentaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedCuentaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.cuentaForm = new FormGroup({
      codigo_cuenta: new FormControl("", [
        Validators.required,                      // Requerido
        Validators.maxLength(25),                 // Longitud máxima de 25 caracteres
      ]),
      nombre_cuenta: new FormControl("", [
        Validators.required,                      // Requerido
        Validators.maxLength(100),                // Longitud máxima de 100 caracteres
        Validators.pattern(/^[a-zA-Z0-9\s]+$/)    // Permite caracteres alfanuméricos y espacios
      ]),
      naturaleza: new FormControl("", [
        Validators.required,                      // Requerido
        Validators.pattern(/^(Deudora|Acreedora|No Aplica)$/)  // Solo permite valores 'Deudora', 'Acreedora' o 'No Aplica'
      ]),
      tipo: new FormControl("", [
        Validators.required,                      // Requerido
        Validators.pattern(/^(Titulo|Mayor|Auxiliar)$/)  // Solo permite valores 'Titulo', 'Mayor' o 'Auxiliar'
      ]),
      id_grupo_genero: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getCuentas();
    this.getGruposCuentas();
  }
 
  aplicarMascara(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 4) {
      valor = valor.substring(0, 4) + '-' + valor.substring(4);
    }
    if (valor.length > 9) {
      valor = valor.substring(0, 9) + '-' + valor.substring(9);
    }
    if (valor.length > 14) {
      valor = valor.substring(0, 14) + '-' + valor.substring(14);
    }
    if (valor.length > 19) {
      valor = valor.substring(0, 19) + '-' + valor.substring(19);
    }
    if (valor.length > 24) {
      valor = valor.substring(0, 24) + '-' + valor.substring(24);
    }

    event.target.value = valor;
  }
  
  getGruposCuentas() {
    this.http.get('http://localhost:3000/api/GruposGenerosCuentas').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.gruposArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }
  
  getCuentas() {
    this.http.get('http://localhost:3000/api/CuentasContables').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.cuentasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  
  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.cuentaForm.value;
    formValue.id_grupo_genero = parseInt(formValue.id_grupo_genero,10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/CuentasContables', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getCuentas();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  
 
   
    // Función para editar una cuenta contable

    onEdit(cuenta: any) {
      this.cuentaForm.patchValue({
        codigo_cuenta: cuenta.codigo_cuenta,
        nombre_cuenta: cuenta.nombre_cuenta,
        naturaleza: cuenta.naturaleza,
        tipo: cuenta.tipo,
        id_grupo_genero: cuenta.grupoGenero ? cuenta.grupoGenero.id_grupo_genero.toString() : '', // Asigna el ID desde grupoGenero
        estatus: cuenta.estatus
      });
    
      this.selectedCuentaId = cuenta.id ? cuenta.id : cuenta.id_cuenta;
    
      if (!this.selectedCuentaId) {
        this.alertService.error('No se encontró un ID válido para la Cuenta Contable seleccionada:', cuenta);
      }
    
      this.isEditMode = true;
    }
    

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedCuentaId) {
      const formValue = this.cuentaForm.value;
      formValue.id_grupo_genero = parseInt(formValue.id_grupo_genero,10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/CuentasContables/${this.selectedCuentaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getCuentas();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna Cuenta Contable para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.cuentaForm.reset({
      codigo_cuenta: "",
      nombre_cuenta:"",
      naturaleza:"",
      tipo:"",
   //   id_grupo_genero:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedCuentaId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/CuentasContables/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Cuenta Contable Eliminada', '');
            this.getCuentas();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
}
