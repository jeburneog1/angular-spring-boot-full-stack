import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-car-status',
  templateUrl: './car-status.component.html',
  styleUrls: ['./car-status.component.css']
})
export class CarStatusComponent implements OnInit {

  constructor(private cartService: CartService) {}

  totalPrice = 0.00;
  totalQuantity = 0;

  ngOnInit(): void {
    this.UpdateCartStatus();
  }

  UpdateCartStatus() {

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
