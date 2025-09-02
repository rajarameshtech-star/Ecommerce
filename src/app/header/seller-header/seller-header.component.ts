import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-seller-header',
  imports: [RouterLink],
  templateUrl: './seller-header.component.html',
  styleUrl: './seller-header.component.css'
})
export class SellerHeaderComponent {
  
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }

}
