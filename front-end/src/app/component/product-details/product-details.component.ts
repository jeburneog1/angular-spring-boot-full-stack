import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product = new Product();

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductList();
    });
  }

  handleProductList() {

    // get "id" param string. convert string to a number using the "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id');

    this.productService.getProductDetails(theProductId).subscribe(
      data => {
        console.log('This return the selected product : ' + data);
        this.product = data;
      }
    );
  }

  addToCart() {

    // When use we the "productDetails" button it updates in the cart
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

}
