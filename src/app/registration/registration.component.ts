import { JsonPipe } from '@angular/common';
import { afterNextRender, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { registerDto } from '../../models/user.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  email: string = "";
  password: string = "";
  roles: string[] = [];
  available_roles = ["Seller", "User", "Moderator"];
  selectedRoles: { [key: string]: boolean } = {};

  constructor(private userService: UsersService, private router:Router) { }

  onSubmit(fr: NgForm) {
    this.roles = this.available_roles.filter(role => this.selectedRoles[role]);

    this.userService.registerUser({email:this.email,password:this.password, roles:this.roles})
      .subscribe({
        next:(data)=>{
          // console.log(data);
          this.router.navigate(["login"]);
          
        },
        error: (err)=> console.log("error is handled")
      })
    
  }
}
