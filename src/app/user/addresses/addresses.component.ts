import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressesService } from '../../services/addresses.service';
import { Address } from '../../../models/user.models';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  addresses: Address[] = [];
  selectedAddressId: string | null = null;

  addressesService = inject(AddressesService);
  router = inject(Router);

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressesService.getAddresses().subscribe(addresses => {
      this.addresses = addresses;
    });
  }

  selectAddress(addressId: string): void {
    this.selectedAddressId = addressId;
  }

  editAddress(addressId: string): void {
    this.router.navigate(['/user/addresses/edit', addressId]);
  }

  addAddress(): void {
    this.router.navigate(['/user/addresses/add']);
  }

  deleteAddress(addressId: string): void {
    this.addressesService.deleteAddress(addressId).subscribe(() => {
      this.loadAddresses();
    });
  }

  proceedToPayment(): void {
    if (this.selectedAddressId) {
      this.addressesService.updateCartAddress(sessionStorage.getItem("cartId") || "", this.selectedAddressId).subscribe({
        next : (data:any) => {
          console.log(data)
            if (data.success) {
              alert("Address selected for the order.");
              this.router.navigate(['/payment', sessionStorage.getItem("cartId")]);
            } else {
              alert('Error in selecting address for the order.');
            }
        }
      })
    }
     else {
      alert('Please select an address.');
    }
  }
}