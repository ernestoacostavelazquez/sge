// sidebar.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  router = inject(Router);
  loggedUserData :any;

  constructor(){
    const loggedData  = localStorage.getItem("loginUser");
    if(loggedData != null){
      this.loggedUserData = JSON.parse(loggedData);
    }
  }

  open:boolean = false;
  submenus: { [key: string]: boolean } = {}; // Estado de submenús

  toggleMenu(){
    this.open = !this.open
  }

  toggleSubmenu(key: string) {
    this.submenus[key] = !this.submenus[key];
  }


  logoff(){
    localStorage.removeItem('loginUser');
    this.router.navigateByUrl('login')
  }
   


}
