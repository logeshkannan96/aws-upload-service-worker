import { Component } from '@angular/core';
import { ScreenRecordingService } from './screenrecord.service';

@Component({
  selector: 'app-recorder',
  standalone: true,
  imports: [],
  template: `
    <button (click)="upload()">Upload</button>
    <button (click)="stop()">Stop</button>
  `,
  styles: ``
})
export class RecorderComponent {
  selectedFile: File | undefined;

  constructor(private screenrecord: ScreenRecordingService) {}

  upload(): void {
      this.screenrecord.startRecordingAndUpload();
  }

  stop(): void {
    this.screenrecord.stopRecording();
  }
}
