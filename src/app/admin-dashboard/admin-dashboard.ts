import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  dashboard: any = null;

  private apiUrl = 'https://vehicle-rental-system-production-2800.up.railway.app';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('DASHBOARD DATA:', data);

        this.dashboard = data;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load dashboard:', error);
      }
    });
  }
}