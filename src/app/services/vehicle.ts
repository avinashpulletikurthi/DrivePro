import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'https://vehicle-rental-system-production-2800.up.railway.app';

  constructor(
    private http: HttpClient
  ) {}

  // GET ALL VEHICLES
  getVehicles() {
    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  // ADD VEHICLE
  addVehicle(vehicle: any) {
    return this.http.post<any>(
      this.apiUrl,
      vehicle
    );
  }

  // UPDATE VEHICLE STATUS
  updateVehicleStatus(
    vehicleId: number,
    status: string
  ) {
    return this.http.put(
      `${this.apiUrl}/${vehicleId}/status`,
      {},
      {
        params: {
          status: status
        },
        responseType: 'text'
      }
    );
  }
  deleteVehicle(vehicleId: number) {
  return this.http.delete(
    `${this.apiUrl}/${vehicleId}`,
    { responseType: 'text' }
  );
}
updateVehicle(vehicleId: number, vehicle: any) {
  return this.http.put<any>(
    `${this.apiUrl}/${vehicleId}`,
    vehicle
  );
}
}