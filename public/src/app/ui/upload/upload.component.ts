import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'cms-upload',
  imports: [CommonModule, MatProgressSpinnerModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  readonly label = input.required<string | undefined>();
  readonly accept = input<string>();
  readonly isEnable = input<boolean>();
  public readonly uploadFile = output<Blob>();
  readonly fileUpload = viewChild<ElementRef>('fileUpload');

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
    const fileUpload = this.fileUpload();
    if (fileUpload) fileUpload.nativeElement.click();
  }
}
