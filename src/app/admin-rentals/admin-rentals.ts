import { Component, OnInit, signal } from '@angular/core';import { CommonModule } from '@angular/common';
import { RentalService } from '../services/rental';

@Component({
  selector: 'app-admin-rentals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-rentals.html',
  styleUrl: './admin-rentals.css'
})
export class AdminRentals implements OnInit {

 rentals = signal<any[]>([]);
  errorMessage = '';

  constructor(private rentalService: RentalService) {}

  ngOnInit(): void {
    this.loadRentals();
  }

  loadRentals(): void {

    this.rentalService.getAllRentals().subscribe({
      next: (data) => {
  console.log('ADMIN RENTALS DATA:', data);
this.rentals.set(data);  this.errorMessage = '';
},
      error: (error) => {
        console.error('Error loading rentals:', error);

        this.errorMessage =
          error.error?.message ||
          'Unable to load rentals.';
      }
    });
  }
}