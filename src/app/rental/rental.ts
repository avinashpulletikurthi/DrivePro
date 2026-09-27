import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RentalService } from '../services/rental';

@Component({
  selector: 'app-rental',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rental.html',
  styleUrl: './rental.css'
})
export class Rental {

  @Input() vehicle: any;

  customerName = '';
  rentalDays = 1;

  message = '';
  errorMessage = '';

  constructor(
    private rentalService: RentalService
  ) {}

  get totalAmount(): number {
    return this.vehicle.pricePerDay * this.rentalDays;
  }

  rentVehicle(): void {

    if (!this.customerName.trim()) {
      this.errorMessage = 'Please enter customer name.';
      return;
    }

    if (this.rentalDays < 1) {
      this.errorMessage = 'Rental days must be at least 1.';
      return;
    }

    const rental = {
      customerName: this.customerName,
      vehicleId: this.vehicle.id,
      rentalDays: this.rentalDays,
      totalAmount: 0
    };

    this.rentalService.rentVehicle(rental).subscribe({

      next: (response) => {

        console.log('RENTAL SUCCESS:', response);

        this.message = 'Vehicle rented successfully!';
        this.errorMessage = '';

      },

      error: (error) => {

        console.error('RENTAL ERROR:', error);

        this.errorMessage =
          error.error?.message || 'Unable to rent vehicle.';

      }

    });
  }

  returnVehicle(): void {

    console.log('Return vehicle:', this.vehicle.id);

  }
}