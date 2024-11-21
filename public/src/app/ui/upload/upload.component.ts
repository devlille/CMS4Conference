import {
  Component,
  ElementRef,
  ViewChild,
  input,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'cms-upload',
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        FormsModule,
    ],
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  readonly label = input.required<string | undefined>();
  readonly accept = input<string>();
  readonly isEnable = input<boolean>();
  public readonly uploadFile = output();
  @ViewChild('fileUpload')
  fileUpload: ElementRef | undefined;

  uploaded = false;

  public id = Math.random().toString(36).substring(2);
  public fileInputId: string;
  public fileName = '';
  inputFileName: string | undefined;

  constructor() {
    this.fileInputId = `input-file-${this.id}`;
  }

  uploadFileEvent(event: any) {
    if (!event.target.files[0]) {
      return;
    }
    this.fileName = event.target.files[0].name;
    this.uploaded = true;
    const files = event.target.files;
    this.uploadFile.emit(files[0]);
  }

  onClick() {
    if (this.fileUpload) this.fileUpload.nativeElement.click();
  }
}
