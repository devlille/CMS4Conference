import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cms-files',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatIconModule],
  template: `
    <mat-list role="list">
      <h3 mat-subheader>Fichiers associés</h3>
      @for (item of files | keyvalue; track item) {
        @if (item.value) {
          <mat-list-item role="listitem">
            <mat-icon matListItemIcon>folder</mat-icon>
            <a
              matListItemTitle
              target="_blank"
              rel="noreferrer"
              rel="noopener"
              [href]="item.value"
              >{{ item.key }}</a
            ></mat-list-item
          >
        }
      }
    </mat-list>
  `,
})
export class FilesComponent {
  @Input()
  files: Record<string, string> | undefined;
}
