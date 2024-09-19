import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ButtonModule } from 'primeng/button';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, ButtonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private auth = inject(Auth);
  title = 'cms4conference';

  login() {
    signInWithPopup(
      this.auth,
      new GoogleAuthProvider().setCustomParameters({
        hd: 'gdglille.org',
      })
    );
  }
}
