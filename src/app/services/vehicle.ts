import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'http://localhost:8080/vehicles';

  constructor(private http: HttpClient) {}

  getVehicles() {
    return this.http.get<any[]>(this.apiUrl);
  }
}