import { Routes } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './features/auth/login/login.component';

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
            
        ]
    }

];
