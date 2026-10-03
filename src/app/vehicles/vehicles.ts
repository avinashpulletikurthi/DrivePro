import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VehicleService } from '../services/vehicle';
import { Rental } from '../rental/rental';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, Rental],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css'
})
export class Vehicles implements OnInit {

  // =========================
  // VEHICLE DATA
  // =========================

  vehicles = signal<any[]>([]);

  selectedVehicle = signal<any>(null);


  // =========================
  // SEARCH / FILTER / SORT
  // =========================

  searchText = signal('');

selectedStatus = signal('ALL');

selectedSort = signal('DEFAULT');

minPrice = signal<number | null>(null);

maxPrice = signal<number | null>(null);
selectedType = signal('ALL');

  filteredVehicles = computed(() => {
    
    let result = [...this.vehicles()];

    // Search
    const search = this.searchText()
      .toLowerCase()
      .trim();

    if (search) {

      result = result.filter(vehicle =>
        vehicle.brand?.toLowerCase().includes(search) ||
        vehicle.model?.toLowerCase().includes(search) ||
        vehicle.vehicleNumber?.toLowerCase().includes(search) ||
        vehicle.type?.toLowerCase().includes(search)
      );

    }


    // Status filter
    const status = this.selectedStatus();

    if (status !== 'ALL') {

      result = result.filter(
        vehicle => vehicle.status === status
      );
      
    }
// Price filter
const min = this.minPrice();
const max = this.maxPrice();

if (min !== null && min > 0) {
  result = result.filter(
    vehicle => vehicle.pricePerDay >= min
  );
}

if (max !== null && max > 0) {
  result = result.filter(
    vehicle => vehicle.pricePerDay <= max
  );
}
// Vehicle type filter
const type = this.selectedType();

if (type !== 'ALL') {
  result = result.filter(
    vehicle =>
      vehicle.type?.toLowerCase() === type.toLowerCase()
  );
}
    // Sorting
    switch (this.selectedSort()) {

      case 'PRICE_LOW':

        result.sort(
          (a, b) =>
            a.pricePerDay - b.pricePerDay
        );

        break;


      case 'PRICE_HIGH':

        result.sort(
          (a, b) =>
            b.pricePerDay - a.pricePerDay
        );

        break;


      case 'BRAND':

        result.sort(
          (a, b) =>
            a.brand.localeCompare(b.brand)
        );

        break;


      default:

        break;

    }

    return result;

  });


  // =========================
  // ADMIN
  // =========================

  showAddVehicle = signal(false);
  showEditVehicle = signal(false);
  editingVehicle = signal<any>(null);

 newVehicle = {
  vehicleNumber: '',
  brand: '',
  model: '',
  type: '',
  pricePerDay: 0,
  status: 'AVAILABLE',
  imageUrl: ''
};


  constructor(
    private vehicleService: VehicleService,
    public authService: AuthService
  ) {}

imagePreview = '';

onImageSelected(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    this.imagePreview = '';
    this.newVehicle.imageUrl = '';
    return;
  }

  const file = input.files[0];

  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file.');
    input.value = '';
    this.imagePreview = '';
    this.newVehicle.imageUrl = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result as string;

    this.imagePreview = imageUrl;
    this.newVehicle.imageUrl = imageUrl;
  };

  reader.readAsDataURL(file);
}
  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {

    this.loadVehicles();

  }


  loadVehicles(): void {

    this.vehicleService.getVehicles().subscribe({

      next: (data) => {

        console.log(
          'VEHICLES FROM API:',
          data
        );

        this.vehicles.set(data);

      },


      error: (error) => {

        console.error(
          'Error loading vehicles:',
          error
        );

      }

    });

  }


  // =========================
  // SEARCH
  // =========================

  setSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchText.set(input.value);

  }

clearFilters(): void {
  this.searchText.set('');
  this.selectedStatus.set('ALL');
  this.selectedSort.set('DEFAULT');
  this.minPrice.set(null);
  this.maxPrice.set(null);
  this.selectedType.set('ALL');
}
  // =========================
  // STATUS FILTER
  // =========================

  setStatus(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    this.selectedStatus.set(select.value);

  }


  // =========================
  // SORT
  // =========================

  setSort(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    this.selectedSort.set(select.value);

  }


  // =========================
  // RENTAL
  // =========================

  openRental(vehicle: any): void {

    if (!this.canRent(vehicle)) {

      return;

    }

    this.selectedVehicle.set(vehicle);

  }


  closeRental(): void {

    this.selectedVehicle.set(null);

  }


  canRent(vehicle: any): boolean {

  return vehicle.status === 'AVAILABLE'
      || vehicle.status === 'RENTED';

}


  // =========================
  // VEHICLE IMAGE
  // =========================

  getVehicleImage(vehicle: any): string {

  if (vehicle.imageUrl && vehicle.imageUrl.trim()) {
    return vehicle.imageUrl;
  }

  const images: {[key: string]: string} = {
    Toyota: '/assets/vehicles/fortuner1.avif',
    Hyundai: '/assets/vehicles/creta1.avif',
    Honda: '/assets/vehicles/city1.avif',
    Maruti: '/assets/vehicles/brezza1.avif',
    Kia: '/assets/vehicles/kia1.avif',
    BMW: '/assets/vehicles/x51.avif',
    Tata: '/assets/vehicles/RoyalBlue-0-3.png'
  };

  return images[vehicle.brand]
  || '/assets/vehicles/download.svg';
}


  // =========================
  // STATUS DESCRIPTION
  // =========================

  getStatusDescription(status: string): string {

    switch (status) {

      case 'AVAILABLE':
        return 'Ready to rent';

      case 'BOOKED':
        return 'Currently booked';

      case 'RENTED':
        return 'Currently rented';

      case 'MAINTENANCE':
        return 'Under maintenance';

      case 'INACTIVE':
        return 'Currently inactive';

      default:
        return status;

    }

  }


  // =========================
  // STATUS LABEL
  // =========================

  getStatusLabel(status: string): string {

    switch (status) {

      case 'AVAILABLE':
        return 'Available';

      case 'BOOKED':
        return 'Booked';

      case 'RENTED':
        return 'Rented';

      case 'MAINTENANCE':
        return 'Maintenance';

      case 'INACTIVE':
        return 'Inactive';

      default:
        return status;

    }

  }


  // =========================
  // ADMIN - ADD VEHICLE
  // =========================

  openAddVehicle(): void {

    this.newVehicle = {
  vehicleNumber: '',
  brand: '',
  model: '',
  type: '',
  pricePerDay: 0,
  status: 'AVAILABLE',
  imageUrl: ''
};

    this.showAddVehicle.set(true);
    this.imagePreview = '';
  }


  closeAddVehicle(): void {

    this.showAddVehicle.set(false);

  }


  addVehicle(): void {

    if (

      !this.newVehicle.vehicleNumber ||

      !this.newVehicle.brand ||

      !this.newVehicle.model ||

      !this.newVehicle.type ||

      this.newVehicle.pricePerDay <= 0

    ) {

      alert(
        'Please fill all vehicle details correctly.'
      );

      return;

    }


    this.vehicleService
      .addVehicle(this.newVehicle)
      .subscribe({

        next: (vehicle) => {

          console.log(
            'Vehicle added:',
            vehicle
          );


          alert(
            'Vehicle added successfully.'
          );


          this.showAddVehicle.set(false);


          this.loadVehicles();

        },


        error: (error) => {

          console.error(
            'Error adding vehicle:',
            error
          );


          alert(
            'Failed to add vehicle.'
          );

        }

      });

  }


  // =========================
  // ADMIN - UPDATE STATUS
  // =========================

  updateVehicleStatus(
    vehicle: any,
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;


    const newStatus =
      select.value;


    this.vehicleService
      .updateVehicleStatus(
        vehicle.id,
        newStatus
      )
      .subscribe({

        next: () => {

          vehicle.status =
            newStatus;


          // Refresh signal
          this.vehicles.set([
            ...this.vehicles()
          ]);


          console.log(
            'Vehicle status updated:',
            newStatus
          );

        },


        error: (error) => {

          console.error(
            'Error updating vehicle status:',
            error
          );


          alert(
            'Failed to update vehicle status.'
          );


          // Reload original data
          this.loadVehicles();

        }

      });

  }
  deleteVehicle(vehicle: any): void {
  const confirmed = confirm(
    `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`
  );

  if (!confirmed) {
    return;
  }

  this.vehicleService.deleteVehicle(vehicle.id).subscribe({
    next: () => {
      alert('Vehicle deleted successfully.');
      this.loadVehicles();
    },
    error: (error) => {
      console.error('Error deleting vehicle:', error);
      alert(error.error?.message || 'Failed to delete vehicle.');
    }
  });
}
openEditVehicle(vehicle: any): void {
  this.editingVehicle.set({
    ...vehicle
  });

  this.editImagePreview = vehicle.imageUrl || '';

  this.showEditVehicle.set(true);
}
onEditImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file.');
    input.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result as string;

    this.editImagePreview = imageUrl;

    const vehicle = this.editingVehicle();

    if (vehicle) {
      this.editingVehicle.set({
        ...vehicle,
        imageUrl: imageUrl
      });
    }
  };

  reader.readAsDataURL(file);
}

closeEditVehicle(): void {
  this.showEditVehicle.set(false);
  this.editingVehicle.set(null);
  this.editImagePreview = '';
}
saveEditedVehicle(): void {
  const vehicle = this.editingVehicle();

  if (!vehicle) {
    return;
  }

  if (
    !vehicle.vehicleNumber ||
    !vehicle.brand ||
    !vehicle.model ||
    !vehicle.type ||
    vehicle.pricePerDay <= 0
  ) {
    alert('Please fill all vehicle details correctly.');
    return;
  }

  this.vehicleService.updateVehicle(vehicle.id, vehicle).subscribe({
    next: () => {
      alert('Vehicle updated successfully.');
      this.closeEditVehicle();
      this.loadVehicles();
    },
    error: (error) => {
      console.error('Error updating vehicle:', error);
      alert(error.error?.message || 'Failed to update vehicle.');
    }
  });
}
editImagePreview = '';
}