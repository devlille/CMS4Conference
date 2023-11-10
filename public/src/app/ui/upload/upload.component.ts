import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
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
  standalone: true,
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
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @Input({ required: true }) label: string | undefined;
  @Input() accept: string | undefined;
  @Input() isEnable: boolean | undefined;
  @Output() public uploadFile = new EventEmitter();
  @ViewChild('fileUpload')
  fileUpload: ElementRef | undefined;

  uploading = false;

  public id = Math.random().toString(36).substring(2);
  public fileInputId: string;
  public fileName = '';

  constructor() {
    this.fileInputId = `input-file-${this.id}`;
  }

  uploadFileEvent(event: any) {
    this.fileName = event.target.files[0].name;
    this.uploading = true;
    const files = event.target.files;
    this.uploadFile.emit(files[0]);
  }
  inputFileName: string | undefined;

  onClick(event: any) {
    if (this.fileUpload) this.fileUpload.nativeElement.click();
  }
}
