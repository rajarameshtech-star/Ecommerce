import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-dummy',
  imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatButton],
  templateUrl: './dummy.component.html',
  styleUrl: './dummy.component.css'
})
export class DummyComponent {

  confirm = new FormControl(false, { nonNullable: true });

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private DialogRef: MatDialogRef<DummyComponent>
  ) {
    
  }

  onCancel() {
    // Close the dialog, return false
    this.DialogRef.close(false);
  }

  onConfirm() {
    // Close the dialog, return true
    this.DialogRef.close(true);
  }
}
