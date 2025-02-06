import { Component, input, output } from '@angular/core';

import { FilesComponent } from '../ui/files/files.component';
import { UploadComponent } from '../ui/upload/upload.component';

@Component({
  selector: 'app-video-input',
  imports: [FilesComponent, UploadComponent],
  template: `
    <div class="social-container-row">
      <p>
        En tant que partenaire Gold, vous pouvez également nous envoyer une video (5mn max). Elle sera publiée sur nos réseaux sociaux et accessible depuis notre site web et nos
        application mobiles. Si vous avez un soucis avec l'upload, vous pouvez nous la partager par email.
      </p>

      <div>
        <cms-upload (uploadFile)="uploadRawVideo.emit($event)" [isEnable]="" label="Video (*.svg)">Choisir une video</cms-upload>
        @if (isAdmin()) {
          <cms-upload (uploadFile)="uploadEditedVideo.emit($event)" [isEnable]="" label="Video (*.svg)">Choisir la video éditée</cms-upload>
        }
        <cms-files [files]="videos()"></cms-files>
      </div>
    </div>
  `
})
export class VideoInputComponent {
  videos = input.required<Record<string, string>>();
  isAdmin = input.required<boolean>();

  uploadRawVideo = output<Blob>();
  uploadEditedVideo = output<Blob>();
}
