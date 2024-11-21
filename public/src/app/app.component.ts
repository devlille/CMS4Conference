import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
    selector: 'cms-root',
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn: boolean | undefined;
  title = environment.title;
  private readonly auth: Auth = inject(Auth);
  private readonly titleService: Title = inject(Title);
  constructor() {
    this.titleService.setTitle(environment.title);
    this.auth.onAuthStateChanged((state) => {
      this.isLoggedIn = !!state?.email?.endsWith('@' + environment.emailDomain);
    });
  }

  login() {
    signInWithPopup(
      this.auth,
      new GoogleAuthProvider().setCustomParameters({
        hd: environment.emailDomain,
      }),
    );
  }

  logout() {
    this.auth.signOut();
  }
}
