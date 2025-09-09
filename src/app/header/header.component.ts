import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../services/users.service';
import { UserHeaaderComponent } from "./user-heaader/user-heaader.component";
import { SellerHeaderComponent } from "./seller-header/seller-header.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-header',
  imports: [
    UserHeaaderComponent,
    SellerHeaderComponent,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
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
