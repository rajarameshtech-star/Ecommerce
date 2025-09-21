import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressesService } from '../../services/addresses.service';
import { Address } from '../../../models/user.models';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule]
})
export class EditAddressComponent implements OnInit {
  addressForm: FormGroup;
  addressId: string | null = null;

  fb = inject(FormBuilder);
  addressesService = inject(AddressesService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {
    this.addressForm = this.fb.group({
      vtc: ['', Validators.required],
      pin: ['', Validators.required],
      landmark: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      apartment: ['', Validators.required],
      type: ['Home', Validators.required]
    });
  }

  ngOnInit(): void {
    this.addressId = this.route.snapshot.paramMap.get('id');
    if (this.addressId) {
      this.addressesService.getAddress(this.addressId).subscribe(address => {
        this.addressForm.patchValue(address);
      });
    }
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const addressData = this.addressForm.value;
      if (this.addressId) {
        this.addressesService.updateAddress(this.addressId, { ...addressData, id: this.addressId }).subscribe(() => {
          this.router.navigate(['/user/addresses']);
        });
      } else {
        this.addressesService.addAddress(addressData).subscribe(() => {
          this.router.navigate(['/user/addresses']);
        });
      }
    }
  }
}