import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loggedIn = computed(() => {return this.usersService.isAuthenticated()})
  constructor(private router:Router, private usersService:UsersService) { 
    
  }

  logout() {
    this.usersService.logoutUser();
    this.router.navigate(['/login']);
  }
}
