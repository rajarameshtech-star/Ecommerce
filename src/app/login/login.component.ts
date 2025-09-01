import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email : string = "";
  password:string="";

  constructor(private userService:UsersService, private router:Router, private activatedRoute:ActivatedRoute){
    activatedRoute.params.subscribe(v=>console.log(v));
  }
  
  onSubmit(fr:NgForm){
    this.userService.loginUser({email:this.email, password:this.password})
    .subscribe({
      next:(response)=>{
        localStorage.setItem("jwt", response.jwt);
        alert("user logged in successfully");
        this.router.navigate(["products"])
      }
    });
  }
}
