import { Routes } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './features/auth/login/login.component';
import { PersonasComponent } from './features/carteras/components/personas/personas.component';
import { LineasComponent } from './features/refacciones/components/lineas/lineas.component';
import { authGuard } from './core/guards/auth.guard';
import { AlmacenesComponent } from './features/refacciones/components/almacenes/almacenes.component';
import { UsuariosComponent } from './features/security/components/usuarios/usuarios.component';
import { RolesComponent } from './features/security/components/roles/roles.component';
import { UnidadMedidaComponent } from './features/refacciones/components/unidad-medida/unidad-medida.component';
import { PaisesComponent } from './features/security/components/paises/paises.component';
import { GenerosComponent } from './features/carteras/components/generos/generos.component';
import { EstadoCivilComponent } from './features/carteras/components/estado-civil/estado-civil.component';
import { CategoriasComponent } from './features/refacciones/components/categorias/categorias.component';
import { TiposDomicilioComponent } from './features/carteras/components/tipos-domicilio/tipos-domicilio.component';
import { TiposPolizaComponent } from './features/contabilidad/components/tipos-poliza/tipos-poliza.component';
import { TiposPersonaComponent } from './features/carteras/components/tipos-persona/tipos-persona.component';
import { GenerosCuentasComponent } from './features/contabilidad/components/generos-cuentas/generos-cuentas.component';
import { GruposCuentasComponent } from './features/contabilidad/components/grupos-cuentas/grupos-cuentas.component';
import { PeriodosContablesComponent } from './features/contabilidad/components/periodos-contables/periodos-contables.component';
import { CatalogoCuentasComponent } from './features/contabilidad/components/catalogo-cuentas/catalogo-cuentas.component';
import { PolizaContableComponent } from './features/contabilidad/components/poliza-contable/poliza-contable.component';
import { CombustiblesComponent } from './features/vehiculos/components/combustibles/combustibles.component';
import { ArmadorasComponent } from './features/vehiculos/components/armadoras/armadoras.component';
import { MarcasComponent } from './features/vehiculos/components/marcas/marcas.component';
import { ModelosComponent } from './features/vehiculos/components/modelos/modelos.component';
import { VersionesComponent } from './features/vehiculos/components/versiones/versiones.component';
import { ColoresComponent } from './features/vehiculos/components/colores/colores.component';
import { ColoresExternosComponent } from './features/vehiculos/components/colores-externos/colores-externos.component';
import { ColoresInternosComponent } from './features/vehiculos/components/colores-internos/colores-internos.component';
import { CarterasComponent } from './features/carteras/components/carteras/carteras.component';
import { TiposCarterasComponent } from './features/carteras/components/tipos-carteras/tipos-carteras.component';
import { BancosComponent } from './features/tesoreria/components/bancos/bancos.component';
import { TiposCajasComponent } from './features/tesoreria/components/tipos-cajas/tipos-cajas.component';
import { CanalesVentaComponent } from './features/refacciones/components/canales-venta/canales-venta.component';
import { SubCategoriasComponent } from './features/refacciones/components/sub-categorias/sub-categorias.component';
import { UnidadesEmpaqueComponent } from './features/refacciones/components/unidades-empaque/unidades-empaque.component';
import { FamiliasComponent } from './features/vehiculos/components/familias/familias.component';

export const routes: Routes = [
    
    {
         path:'',
         redirectTo:'login',
         pathMatch:'full'
     },
     { 
        path:'login', 
        component: LoginComponent
        //component: SidebarComponent
    },
    {
       path:'Sidebar',
       component: SidebarComponent,
       children:[
        { 
            path:'add-pers', 
            component: PersonasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent
            
        },
        { 
            path:'add-almacenes', 
            component: AlmacenesComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        { 
            path:'add-lineas', 
            component: LineasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        { 
            path:'add-usuarios', 
            component: UsuariosComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-roles', 
            component: RolesComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-unidad-medida', 
            component: UnidadMedidaComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-paises', 
            component: PaisesComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-generos', 
            component:GenerosComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-estadoCivil', 
            component: EstadoCivilComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-categorias', 
            component: CategoriasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-unidadesEmpaque', 
            component: UnidadesEmpaqueComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-tiposDomicilio', 
            component: TiposDomicilioComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-tiposPoliza', 
            component: TiposPolizaComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-tiposPersona', 
            component: TiposPersonaComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-generosCuenta', 
            component: GenerosCuentasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-gruposCuenta', 
            component: GruposCuentasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-periodosContables', 
            component: PeriodosContablesComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-catalogoCuentas', 
            component: CatalogoCuentasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-polizaContable', 
            component: PolizaContableComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-combustibles', 
            component:CombustiblesComponent ,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-armadoras', 
            component:ArmadorasComponent ,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-marcas', 
            component:MarcasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-modelos', 
            component:ModelosComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-versiones', 
            component:VersionesComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-colores', 
            component:ColoresComponent ,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-coloresExternos', 
            component:ColoresExternosComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-coloresInternos', 
            component:ColoresInternosComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-carteras', 
            component:CarterasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-tiposCarteras', 
            component:TiposCarterasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-bancos', 
            component:BancosComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-tiposCajas', 
            component:TiposCajasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-canalesVenta', 
            component:CanalesVentaComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-subCategorias', 
            component:SubCategoriasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        },
        {
            path:'add-familias', 
            component: FamiliasComponent,
            canActivate:[authGuard]
            //component: SidebarComponent  
        }

        ]
    }

];
