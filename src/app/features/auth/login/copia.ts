import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { AlertComponent } from '../../../shared/components/alert/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule,ReactiveFormsModule], // Eliminar la coma extra
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Cambiado de styleUrl a styleUrls
})
export class LoginComponent {
  userObj: any = {
    email: '',
    password: ''
  };

  router = inject(Router);
  http = inject(HttpClient); // Corrección aquí

  onLogin() {
    this.http.post("http://localhost:3000/api/users/login", this.userObj).subscribe((res: any) => {
      if (res.result) {
        //alert("login Success");
        AlertComponent.success('Login Exitoso', 'Bienvenido !');
        localStorage.setItem('loginUser', JSON.stringify(res.data) );
        this.router.navigateByUrl('Sidebar');
      } else {
        AlertComponent.error('Ooops...', res.message)
      // alert(res.message);
      }
    }, error => {
      AlertComponent.error('Ooops...','Credenciales incorrectas.')
      // alert('Error de conexión o credenciales incorrectas.');
      // console.error('Login failed:', error);
    });
  }
}
