import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  private apiUrl = 'http://localhost:8080/rentals';

  constructor(private http: HttpClient) {}

  rentVehicle(rental: any) {
    return this.http.post<any>(this.apiUrl, rental);
  }

  returnVehicle(rentalId: number) {
    return this.http.put<any>(
      `${this.apiUrl}/${rentalId}/return`,
      {}
    );
  }

  getRentals() {
    return this.http.get<any[]>(this.apiUrl);
  }
  cancelRental(rentalId: number, userId: number) {
  return this.http.put<any>(
    `${this.apiUrl}/cancel/${rentalId}?userId=${userId}`,
    {}
  );
}
getAllRentals() {
  return this.http.get<any[]>(
    `${this.apiUrl}/admin`
  );
}
}