import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { NgIf } from '@angular/common';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule,ReactiveFormsModule,NgIf], // Eliminar la coma extra
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Cambiado de styleUrl a styleUrls
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({}); // Definir el FormGroup para el formulario

  router = inject(Router);

  constructor(private http: HttpClient, private alertService: AlertService){}
 // http = inject(HttpClient, );

  ngOnInit() {
    // Inicializar el formulario
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]), // Validaciones para el email
      password: new FormControl('', [Validators.required, Validators.minLength(6)]) // Validaciones para la contraseña
    });
  }

  onLogin() {
    debugger;
    if (this.loginForm.valid) { // Verifica si el formulario es válido
      this.http.post("http://localhost:3000/api/users/login", this.loginForm.value).subscribe((res: any) => {
        debugger;
        if (res.result) {
          this.alertService.success('Login Exitoso', '¡Bienvenido!');
          localStorage.setItem('loginUser', JSON.stringify(res.data));
          this.router.navigateByUrl('Sidebar');
        } else {
          this.alertService.error('Ooops...', res.message);
        }
      }, error => {
        this.alertService.error('Ooops...', 'Credenciales incorrectas.');
      });
    } else {
      this.alertService.error('Error', 'Por favor, completa todos los campos correctamente.');
    }
  }
}
