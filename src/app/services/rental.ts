import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  private apiUrl = 'https://vehicle-rental-system-production-2800.up.railway.app';

  constructor(private http: HttpClient) {}

  rentVehicle(rental: any) {
    return this.http.post<any>(
      `${this.apiUrl}/rentals`,
      rental
    );
  }

  returnVehicle(rentalId: number) {
    return this.http.put<any>(
      `${this.apiUrl}/rentals/${rentalId}/return`,
      {}
    );
  }

  getRentals() {
    return this.http.get<any[]>(
      `${this.apiUrl}/rentals`
    );
  }

  cancelRental(rentalId: number, userId: number) {
    return this.http.put<any>(
      `${this.apiUrl}/rentals/cancel/${rentalId}?userId=${userId}`,
      {}
    );
  }

  getAllRentals() {
    return this.http.get<any[]>(
      `${this.apiUrl}/rentals/admin`
    );
  }
}