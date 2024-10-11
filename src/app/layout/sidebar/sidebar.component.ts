import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  router = inject(Router);

  open:boolean = false;

  toggleMenu(){
    this.open = !this.open
  }


  logoff(){
    localStorage.removeItem('loginUser');
    this.router.navigateByUrl('login')
  }
   


}
