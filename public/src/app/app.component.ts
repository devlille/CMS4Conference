import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'cms-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    isLoggedIn: boolean | undefined;

    private auth: Auth = inject(Auth);
    constructor() {
        this.auth.onAuthStateChanged(state => {
            this.isLoggedIn = !!state?.email?.endsWith('@gdglille.org');
        });
    }

    login() {
        signInWithPopup(this.auth, new GoogleAuthProvider().setCustomParameters({ hd: 'gdglille.org' }));
    }

    logout() {
        this.auth.signOut();
    }
}
