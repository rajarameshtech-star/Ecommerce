import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../services/users.service';
import { UserHeaaderComponent } from "./user-heaader/user-heaader.component";
import { SellerHeaderComponent } from "./seller-header/seller-header.component";

@Component({
  selector: 'app-header',
  imports: [UserHeaaderComponent, SellerHeaderComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loggedIn = computed(() => {return this.usersService.isAuthenticated()});
  userRole = computed(() => {return this.usersService.userRole()});
  constructor(private router:Router, private usersService:UsersService) { 
    
  }

  logout() {
    this.usersService.logoutUser();
    this.router.navigate(['/login']);
  }
}
