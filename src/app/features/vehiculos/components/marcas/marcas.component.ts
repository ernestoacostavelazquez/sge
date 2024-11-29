// marcas.compenents.ts
import { CommonModule,  NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-marcas',
    imports: [ReactiveFormsModule, HttpClientModule,  NgFor, NgIf, CommonModule],
    templateUrl: './marcas.component.html',
    styleUrl: './marcas.component.css'
})
export class MarcasComponent {

    
  marcasArray: any[] = [];
  armadorasArray: any[] = []; // Array para almacenar géneros de cuentas
  marcaForm: FormGroup;
  isEditMode = false; // Variable para controlar si estamos en modo de edición
  selectedMarcaId: number | null = null; // Variable para almacenar el ID de la linea seleccionado


  usuarioData: any = null;
  usuarioRol: string = '';
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Añadir validadores al formulario
    this.marcaForm = new FormGroup({
      nombre_marca: new FormControl("", [Validators.required]),
      id_armadora: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]), // Campo para el ID del género
      descripcion_marca: new FormControl("", [Validators.required]), // Validador para números enteros
      estatus: new FormControl(true)
    });
    this.getUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.getMarcas();
    this.getArmadoras(); // Cargar los géneros de cuentas al inicio
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
  
 
  
  getMarcas() {
    this.http.get('http://localhost:3000/api/Marcas').subscribe((res: any) => {
      if (Array.isArray(res.data)) {
        this.marcasArray = res.data;
      } else {
        this.alertService.error("La respuesta no contiene un arreglo", res.mensaje);
      }
    });
  }

  // Función para guardar un nuevo la linea
  onSave() {
    const formValue = this.marcaForm.value;
    formValue.id_armadora = parseInt(formValue.id_armadora, 10); // Convertir a número
    formValue.created_by = this.usuarioRol;

    this.http.post('http://localhost:3000/api/Marcas', formValue).subscribe((res: any) => {
      if (res.result) {
        this.alertService.success('Registro Exitoso', '');
        this.getMarcas();
        this.resetForm(); // Resetear el formulario después de guardar
      } else {
        this.alertService.error('Ooops...', res.message);
      }
    });
  }

  // Función para editar un rol
  onEdit(marca: any) {
    this.marcaForm.patchValue({
      nombre_marca: marca.nombre_marca,
      id_armadora:  marca.armadora?.id_armadora || 0,  // Set el id del género correspondiente
      descripcion_marca: marca.descripcion_marca,
      estatus: marca.estatus,
    });  // Usar patchValue para llenar los campos del formulario
    
    

    // Comprobar si el liean tiene un campo 'id' o 'id_linea'
    this.selectedMarcaId = marca.id ? marca.id : marca.id_marca; // Ajustar según el nombre del campo
    if (!this.selectedMarcaId) {
      this.alertService.error('No se encontró un ID válido para la marca seleccionada:', marca);
    }
    
    this.isEditMode = true; // Cambiar a modo de edición
  }

  // Función para actualizar una linea existente
  onUpdate() {
    if (this.selectedMarcaId) {
      const formValue = this.marcaForm.value;
      formValue.id_armadora = parseInt(formValue.id_armadora, 10); // Convertir a número
      formValue.updated_by = this.usuarioRol;

      this.http.put(`http://localhost:3000/api/Marcas/${this.selectedMarcaId}`, formValue).subscribe((res: any) => {
        if (res.result) {
          this.alertService.success('Actualización Exitosa', '');
          this.getMarcas();
          this.resetForm(); // Resetear el formulario después de la actualización
          this.isEditMode = false;
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      });
    } else {
      // Mostrar mensaje de error si no se ha seleccionado un rol para actualizar
      console.error("No se ha seleccionado ninguna marca para actualizar.");
    }
  }

  // Función para resetear el formulario y volver al modo de creación
  resetForm() {
    this.marcaForm.reset({
      nombre_marca: "",
      id_armadora:"",
      descripcion_marca:"",
      estatus: true
    });
    this.isEditMode = false;
    this.selectedMarcaId = null; // Limpiar la selección de linea
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
        this.http.delete(`http://localhost:3000/api/Marcas/${id}`).subscribe((res: any) => {
          if (res.result) {
            this.alertService.success('Marca Eliminada', '');
            this.getMarcas();
          } else {
            this.alertService.error('Ooops...', res.message);
          }
        });
      }
    });
  }
  

}
