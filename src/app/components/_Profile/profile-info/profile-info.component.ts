import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TelegramService } from '../../../services/_Telegram/telegram.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../services/_Profile/profile.service';
import { UserProfileResponse } from '../../../interfaces/_Profile/friend.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent implements OnInit {
  @Input() avatarUrl!: string;
  @Input() username!: string;
  @Input() points!: number;
  @Input() referralLink!: string;
  @Input() status!: string;

  friends: { username: string; points: number }[] = [];
  totalFriendPoints: number = 0;

  constructor(
    private profileService: ProfileService,
    private telegramService: TelegramService,
    private router: Router
  ) { }

  ngOnInit() {
    // Загружаем данные из Telegram API
    const user = this.telegramService.getUser();
    if (user) {
      this.username = user.username || `${user.first_name} ${user.last_name}` || 'Unknown User';
      this.avatarUrl = user.photo_url || ''; // Фото из Telegram
    }

    // Загружаем данные профиля с сервера
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.profileService.getUserProfile().subscribe({
      next: (profile: UserProfileResponse) => {
        this.points = profile.points;
        this.referralLink = profile.referral_link;
        this.status = profile.status;
        this.friends = profile.referrals.map((ref) => ({
          username: ref.username,
          points: ref.earnings,
        }));
        this.totalFriendPoints = this.friends.reduce(
          (total, friend) => total + friend.points,
          0
        );
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных профиля:', err);
      },
    });
  }

  copyReferralLink() {
    // Копирование реальной реферальной ссылки в буфер обмена
    navigator.clipboard.writeText(this.referralLink).then(() => {
      if (this.telegramService.isTelegramWebAppAvailable()) {
        // Используем Telegram alert
        this.telegramService.showTelegramAlert('Ссылка скопирована в буфер обмена!');
      } else {
        // Fallback на стандартный alert
        alert('Ссылка скопирована в буфер обмена!');
      }
    }).catch(() => {
      console.error('Ошибка при копировании ссылки');
    });
  }
  

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'gold':
        return 'status-gold';
      case 'black':
        return 'status-black';
      case 'diamond':
        return 'status-diamond';
      case 'silver':
        return 'status-silver';
      default:
        return '';
    }
  }

  navigateToPurchases(): void {
    this.router.navigate(['profile/my-purchases']);
  }


}