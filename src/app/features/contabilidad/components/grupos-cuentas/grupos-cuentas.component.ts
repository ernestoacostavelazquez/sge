import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-grupos-cuentas',
    imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf, CommonModule],
    templateUrl: './grupos-cuentas.component.html',
    styleUrl: './grupos-cuentas.component.css'
})
export class GruposCuentasComponent {

  gruposGenerosArray: any[] = [];
  generosCuentasArray: any[] = []; // Array para almacenar géneros de cuentas
  grupoGeneroForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedGrupoGeneroId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.grupoGeneroForm = new FormGroup({
      nombre_grupo: new FormControl("", [Validators.required]),
      id_genero_cuenta: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      codigo_grupo: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]+$")]), // Validador para números enteros
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getGruposGeneros();
    this.getGenerosCuentas(); // Cargar los géneros de cuentas al inicio
  }

  getGenerosCuentas() {
    this.http.get('http://localhost:3000/api/GenerosCuentasContables').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.generosCuentasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }
  
 
  
  getGruposGeneros() {
    this.http.get('http://localhost:3000/api/GruposGenerosCuentas').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.gruposGenerosArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.grupoGeneroForm.value;
    formValue.id_genero_cuenta = parseInt(formValue.id_genero_cuenta, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/GruposGenerosCuentas', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getGruposGeneros();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(grupoGenero: any) {
    this.grupoGeneroForm.patchValue({
      nombre_grupo: grupoGenero.nombre_grupo,
      id_genero_cuenta:  grupoGenero.genero?.id_genero_cuenta || 0,  // Set el id del género correspondiente
      codigo_grupo: grupoGenero.codigo_grupo,
      estatus: grupoGenero.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedGrupoGeneroId = grupoGenero.id ? grupoGenero.id : grupoGenero.id_grupo_genero; // Ajustar según el nombre del campo
    if (!this.selectedGrupoGeneroId) {
      this.alertService.error('No se encontró un ID válido para el grupo de genero seleccionado:', grupoGenero);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedGrupoGeneroId) {
      const formValue = this.grupoGeneroForm.value;
      formValue.id_genero_cuenta = parseInt(formValue.id_genero_cuenta, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/GruposGenerosCuentas/${this.selectedGrupoGeneroId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getGruposGeneros();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ningun grupo para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.grupoGeneroForm.reset({
      nombre_grupo: "",
      id_genero_cuenta:"",
      codigo_grupo:null,
      estatus: true
    });
    this.isEditMode = false;
    this.selectedGrupoGeneroId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/GruposGenerosCuentas/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Grupo Eliminado', '');
            this.getGruposGeneros();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }

}
