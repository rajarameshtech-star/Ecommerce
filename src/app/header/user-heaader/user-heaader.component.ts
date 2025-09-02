import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-heaader',
  imports: [RouterLink],
  templateUrl: './user-heaader.component.html',
  styleUrl: './user-heaader.component.css'
})
export class UserHeaaderComponent {
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }
}
