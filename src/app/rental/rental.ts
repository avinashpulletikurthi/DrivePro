import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  @Output() rentalCompleted = new EventEmitter<void>();

  constructor(private rentalService: RentalService) {}

  customerName = '';

  startDate = '';
  endDate = '';

  message = '';
  errorMessage = '';

  get rentalDays(): number {
    if (!this.startDate || !this.endDate) {
      return 0;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    const difference =
      end.getTime() - start.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  get totalAmount(): number {
    if (this.rentalDays <= 0) {
      return 0;
    }

    return this.vehicle.pricePerDay * this.rentalDays;
  }

  rentVehicle(): void {

    this.errorMessage = '';
    this.message = '';

    if (!this.customerName.trim()) {
      this.errorMessage = 'Please enter customer name.';
      return;
    }

    if (!this.startDate || !this.endDate) {
      this.errorMessage =
        'Please select rental start and end dates.';
      return;
    }

    if (this.rentalDays <= 0) {
      this.errorMessage =
        'End date must be after start date.';
      return;
    }

    const rental = {
      customerName: this.customerName,
      vehicleId: this.vehicle.id,
      startDate: this.startDate,
      endDate: this.endDate,
      rentalDays: this.rentalDays,
      totalAmount: this.totalAmount
    };

    this.rentalService.rentVehicle(rental).subscribe({
      next: (response) => {

        console.log('RENTAL SUCCESS:', response);

        this.message =
          'Vehicle rented successfully!';

        this.errorMessage = '';

        this.rentalCompleted.emit();
      },

      error: (error) => {

        console.error('RENTAL ERROR:', error);

        this.errorMessage =
          error.error?.message ||
          'Unable to rent vehicle.';
      }
    });
  }

  returnVehicle(): void {

    this.rentalService
      .returnVehicle(this.vehicle.id)
      .subscribe({

        next: (response) => {

          console.log('RETURN SUCCESS:', response);

          this.message =
            'Vehicle returned successfully!';

          this.errorMessage = '';
        },

        error: (error) => {

          console.error('RETURN ERROR:', error);

          this.errorMessage =
            error.error?.message ||
            'Unable to return vehicle.';
        }
      });
  }
}