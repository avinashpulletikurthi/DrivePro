import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  totalVehicles = signal(0);
  availableVehicles = signal(0);
  bookedVehicles = signal(0);
  rentedVehicles = signal(0);

  private apiUrl = 'https://vehicle-rental-system-production-2800.up.railway.app';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVehicleStats();
  }

  loadVehicleStats(): void {

    this.http.get<any[]>(this.apiUrl).subscribe({

      next: (vehicles) => {

        this.totalVehicles.set(vehicles.length);

        this.availableVehicles.set(
          vehicles.filter(
            vehicle => vehicle.status === 'AVAILABLE'
          ).length
        );

        this.bookedVehicles.set(
          vehicles.filter(
            vehicle => vehicle.status === 'BOOKED'
          ).length
        );

        this.rentedVehicles.set(
          vehicles.filter(
            vehicle => vehicle.status === 'RENTED'
          ).length
        );

        // console.log('TOTAL:', this.totalVehicles());
        // console.log('AVAILABLE:', this.availableVehicles());
        // console.log('BOOKED:', this.bookedVehicles());
        // console.log('RENTED:', this.rentedVehicles());
      },

      error: (error) => {

        console.error(
          'Failed to load vehicle statistics:',
          error
        );

      }

    });

  }
}