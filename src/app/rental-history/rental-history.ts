import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RentalService } from '../services/rental';
import { VehicleService } from '../services/vehicle';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-rental-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rental-history.html',
  styleUrl: './rental-history.css'
})
export class RentalHistory implements OnInit {

  rentals = signal<any[]>([]);

  message = '';
  errorMessage = '';

  constructor(
  private rentalService: RentalService,
  private vehicleService: VehicleService,
  private authService: AuthService
) {}

  ngOnInit(): void {
    this.loadRentals();
  }

  loadRentals(): void {

    this.rentalService.getRentals().subscribe({

      next: (rentals) => {

        this.vehicleService.getVehicles().subscribe({

          next: (vehicles) => {

            const updatedRentals = rentals.map(rental => {

              const vehicle = vehicles.find(
                v => v.id === rental.vehicleId
              );

              return {
                ...rental,
                vehicleBrand: vehicle
                  ? `${vehicle.brand} ${vehicle.model}`
                  : null
              };

            });

            this.rentals.set(updatedRentals);
          },

          error: (error) => {
            console.error('Error loading vehicles:', error);
            this.rentals.set(rentals);
          }

        });

      },

      error: (error) => {
        console.error('Error loading rentals:', error);
        this.errorMessage = 'Unable to load rental history.';
      }

    });
  }

  returnVehicle(rentalId: number): void {

    this.rentalService.returnVehicle(rentalId).subscribe({

      next: () => {

        this.message = 'Vehicle returned successfully!';
        this.errorMessage = '';

        this.loadRentals();
      },

      error: (error) => {

        console.error('Return error:', error);
        this.errorMessage = 'Unable to return vehicle.';
      }

    });
  }
  cancelRental(rentalId: number): void {

  const confirmed = confirm(
    'Are you sure you want to cancel this rental?'
  );

  if (!confirmed) {
    return;
  }

  const userId = this.authService.getUserId();

if (userId === null) {
  this.errorMessage = 'Unable to identify logged-in user.';
  return;
}

  this.rentalService.cancelRental(rentalId, userId).subscribe({
    next: () => {
      this.message = 'Rental cancelled successfully!';
      this.errorMessage = '';
      this.loadRentals();
    },
    error: (error) => {
      console.error('Cancel rental error:', error);

      this.errorMessage =
        error.error?.message ||
        'Unable to cancel rental.';
    }
  });
}
}