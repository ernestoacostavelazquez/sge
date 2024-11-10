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
import { EmpaqueComponent } from './features/refacciones/components/empaque/empaque.component';
import { TiposDomicilioComponent } from './features/carteras/components/tipos-domicilio/tipos-domicilio.component';
import { TiposPolizaComponent } from './features/contabilidad/components/tipos-poliza/tipos-poliza.component';
import { TiposPersonaComponent } from './features/carteras/components/tipos-persona/tipos-persona.component';
import { GenerosCuentasComponent } from './features/contabilidad/components/generos-cuentas/generos-cuentas.component';
import { GruposCuentasComponent } from './features/contabilidad/components/grupos-cuentas/grupos-cuentas.component';
import { PeriodosContablesComponent } from './features/contabilidad/components/periodos-contables/periodos-contables.component';
import { CatalogoCuentasComponent } from './features/contabilidad/components/catalogo-cuentas/catalogo-cuentas.component';
import { PolizaContableComponent } from './features/contabilidad/components/poliza-contable/poliza-contable.component';

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
            path:'add-empaque', 
            component: EmpaqueComponent,
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
        }

        ]
    }

];
