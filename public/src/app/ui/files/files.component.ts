import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'cms-files',
  imports: [CommonModule, MatListModule, MatIconModule, MatIconModule],
  template: `
    <mat-list role="list">
      <h3 mat-subheader>Fichiers associés</h3>
      @for (item of files() | keyvalue; track item) {
        @if (item.value) {
          <mat-list-item role="listitem">
            <mat-icon matListItemIcon>folder</mat-icon>
            <a matListItemTitle target="_blank" rel="noreferrer" rel="noopener" [href]="item.value">{{ item.key }}</a></mat-list-item
          >
        }
      }
    </mat-list>
  `
})
export class FilesComponent {
  readonly files = input<Record<string, string>>();
}
