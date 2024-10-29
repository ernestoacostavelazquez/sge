import { Component, AfterViewInit } from '@angular/core';

declare var $: any;  

@Component({
  selector: 'app-unidad-medida',
  standalone: true,
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['./unidad-medida.component.css']
})
export class UnidadMedidaComponent implements AfterViewInit   {

  ngAfterViewInit(): void {
    // Inicializar DataTables después de que la vista esté completamente renderizada
    ($('#example') as any).DataTable({
      "paging": true,  // Activa la paginación
      "ordering": true, // Permite ordenar columnas
      "info": true,     // Muestra información de la tabla
      "searching": true // Activa la barra de búsqueda
    });
  }
  
}
