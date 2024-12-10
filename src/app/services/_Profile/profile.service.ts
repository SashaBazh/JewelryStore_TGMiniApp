import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { UserProfileResponse } from '../../interfaces/_Profile/friend.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/user`;

  private headers = new HttpHeaders({
    'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
  });

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/profile`, { headers: this.headers });
  }

  checkIfAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-admin`, { headers: this.headers });
  }  
  
}
