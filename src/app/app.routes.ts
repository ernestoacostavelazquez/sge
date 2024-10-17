import { Routes } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './features/auth/login/login.component';
import { PersonasComponent } from './features/carteras/components/personas/personas.component';
import { LineasComponent } from './features/refacciones/components/lineas/lineas.component';
import { authGuard } from './core/guards/auth.guard';
import { AlmacenesComponent } from './features/refacciones/components/almacenes/almacenes.component';
import { UsuariosComponent } from './features/security/components/usuarios/usuarios.component';
import { RolesComponent } from './features/security/components/roles/roles.component';

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
        }

        ]
    }

];
