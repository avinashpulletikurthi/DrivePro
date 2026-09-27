import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleService } from '../services/vehicle';
import { Rental } from '../rental/rental';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, Rental],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css'
})
export class Vehicles implements OnInit {

  vehicles = signal<any[]>([]);
  selectedVehicle = signal<any>(null);

  constructor(
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {

    this.vehicleService.getVehicles().subscribe({

      next: (data) => {
        console.log('VEHICLES FROM API:', data);
        this.vehicles.set(data);
      },

      error: (error) => {
        console.error('Error loading vehicles:', error);
      }

    });

  }

  openRental(vehicle: any): void {
    this.selectedVehicle.set(vehicle);
  }

  closeRental(): void {
    this.selectedVehicle.set(null);
  }
}