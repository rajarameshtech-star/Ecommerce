import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductEventsService {

  constructor() { }

  productsChanged:BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  triggerProductChangeEvent() {
    this.productsChanged.next();
  }
}
