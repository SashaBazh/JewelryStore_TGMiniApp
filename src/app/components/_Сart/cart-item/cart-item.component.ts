import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../services/_Cart/cart.service';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent {
  @Input() imageSrc!: string;
  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() quantity: number = 1;
  @Input() productId: number = 0;

  @Output() itemRemoved = new EventEmitter<number>(); // Событие для уведомления родителя
  @Output() quantityChanged = new EventEmitter<{ productId: number; quantity: number }>();

  constructor(
    private cartService: CartService,
    public imageService: ImageStreamService
  ) { }

  increaseQuantity() {
    this.quantity++;
    this.updateQuantity();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateQuantity();
    }
  }


  updateQuantity() {
    this.cartService.updateItemQuantity(this.productId, this.quantity).subscribe({
      next: () => {
        console.log('Количество обновлено');
        this.quantityChanged.emit({ productId: this.productId, quantity: this.quantity });
      },
      error: (err) => {
        console.error('Ошибка при обновлении количества:', err);
      },
    });
  }

  removeItem() {
    this.cartService.removeItemFromCart(this.productId).subscribe({
      next: () => {
        console.log('Товар удален из корзины');
        this.itemRemoved.emit(this.productId); // Уведомляем родителя об удалении
      },
      error: (err) => {
        console.error('Ошибка при удалении товара из корзины:', err);
      },
    });
  }

  setDefaultImage(event: Event): void {
    (event.target as HTMLImageElement).src = '../../../../assets/products/2.png';
  }
  
}
