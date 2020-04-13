import { CartService } from './../../services/cart.service';
import { Product } from './../../common/product';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId = 1;
  currentCategoryName: string;
  searchMode: boolean;
  previousCategoryId = 1;
  hideContent: boolean;
  hideContentVar: boolean;

  // new properties for pagination
  thePageNumber = 1;
  thePageSize = 20;
  theTotalElements = 0;
  previousKeyword: string = null;

  constructor(private producteService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
      this.hideContent = true;
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    /**
     * if we have a diferent keyword than previous
     * then set pageNumber to 1
     */
    // tslint:disable-next-line: triple-equals
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    // now search for the products using keyword
    this.producteService.searchProductsPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult());
    // tslint:disable-next-line: triple-equals

  }


  handleListProducts() {
        // check if "id" parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
        if (hasCategoryId) {
          // get the "id" param string. Convert string to a number using the "+" symbol
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
          // get the "name" param string.
          this.currentCategoryName = this.route.snapshot.paramMap.get('name');
        } else {
          // not category id available...  default to category id 1
          this.currentCategoryId = 1;
          // not category id available...  default to category 'Books'
          this.currentCategoryName = 'Books';
        }

        /**
         * Check if we have a different category than previous
         * Note: Angular will reuse a component if it is currently being viewed
         */

        /**
         * if we have a different category id than previous
         * then set thePageNumber bact to 1
         */

        // tslint:disable-next-line: triple-equals
        if (this.previousCategoryId != this.currentCategoryId) {
           this.thePageNumber = 1;
         }

        this.previousCategoryId = this.currentCategoryId;

        console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

        // now get the products for the given category id
        this.producteService.getProductListPaginate(this.thePageNumber - 1,
                                                    this.thePageSize,
                                                    this.currentCategoryId)
                                                    .subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };

  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {

    console.log(theProduct.name);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
