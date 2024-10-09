import { Component, inject  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userObj:any = {
    email:'',
    password:''
  }

  router = inject(Router)
  onLogin(){

    if( this.userObj.email == "ernesto.acostavelazquez@gmail.com" && this.userObj.password == "1234"){
      alert("login Success")    
      this.router.navigateByUrl('Sidebar')
    }else {
      alert('Wrong Credentials')
    }

  }

}
