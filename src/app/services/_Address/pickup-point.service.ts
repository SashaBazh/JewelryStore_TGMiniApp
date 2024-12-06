import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { PickupPoint } from '../../interfaces/_Address/pickup-point.interface';
import { environment } from '../../enviroments/environment';


@Injectable({
  providedIn: 'root'
})
export class PickupPointService {

  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) { }

  getPickupPoints(): Observable<PickupPoint[]> {
    return this.http.get<PickupPoint[]>(`${this.apiUrl}/pickup-locations`);
  }
}
