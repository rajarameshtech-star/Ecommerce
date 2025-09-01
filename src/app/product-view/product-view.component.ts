import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { ProductInfo } from '../../models/product.models';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-view',
  imports: [CommonModule],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit {

  productId!:string;
  product:ProductInfo|undefined;

  constructor(private productsServie:ProductsService, private activeRoute:ActivatedRoute){
    activeRoute.params.subscribe(v=> this.productId=v["id"]);
    this.productsServie.getProductId(this.productId).subscribe({
      next: (data)=>{
        this.product=data;
      }
    })
  }

  ngOnInit() {
    
  }

  multiply(n:number) {
    let t = '';
    for(let i=0; i < n; i++){
      t+='⭐';
    }

    return t;
  }
}
