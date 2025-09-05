import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-seller-header',
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './seller-header.component.html',
  styleUrl: './seller-header.component.css'
})
export class SellerHeaderComponent {
  
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }

}
