import { Routes } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './features/auth/login/login.component';
import { PersonasComponent } from './features/carteras/components/personas/personas.component';
import { LineasComponent } from './features/refacciones/components/lineas/lineas.component';

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
            component: PersonasComponent
            //component: SidebarComponent
            
        },
        { 
            path:'add-lineas', 
            component: LineasComponent
            //component: SidebarComponent
            
        }

        ]
    }

];
