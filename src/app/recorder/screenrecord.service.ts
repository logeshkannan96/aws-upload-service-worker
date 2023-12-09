// screen-recording.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenRecordingService {

  mediaRecorder: MediaRecorder | undefined;
  stream: MediaStream | undefined;
  constructor() { }

  async startRecordingAndUpload(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const upload = this.uploadToAWS.bind(this);
      const videoElement = document.createElement('video');
      videoElement.srcObject = this.stream;
      document.body.appendChild(videoElement);
      videoElement.hidden = true;

      this.mediaRecorder = new MediaRecorder(this.stream);
      const chunks: Blob[] = [];

      this.mediaRecorder.start();

      this.mediaRecorder.onstop = async () => {
        const recordedBlob = new Blob(chunks, { type: 'video/webm' });

          navigator.serviceWorker.controller?.postMessage({ blob: recordedBlob, action: 'recording-upload', token: localStorage.getItem('token')!});
          // await upload(recordedBlob); // route to applications upload flow
      };

      this.mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

    } catch (error) {
      console.error('Error accessing user screen:', error);
    }
  }

  private async uploadToAWS(blob: Blob): Promise<void> {
    console.log('Uploading to AWS')
    const url = await this.getUrl();
    const formData = new FormData();
    formData.append('file', blob, 'tempscreenrecording.webm');
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'video/webm',
        'Access-Control-Allow-Origin': '*',
      },
      method: 'PUT',
      body: formData,
      mode: 'cors'
    });
    console.log('Success:', response);
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
    }
  }

  private async getUrl(): Promise<string> {
    const myHeaders = new Headers();
    console.log(localStorage.getItem('token')!)
    myHeaders.append("Authorization", localStorage.getItem('token')!);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "file_name": "tempscreenrecording.webm",
        "type": "video/webm",
        "bucket_type": "public",
        "extend": "true",
        "bucket_name": "recording-bucket"
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect,
      mode: 'cors' // Add this line to enable CORS
    };

    const response = await fetch("<api-endpoint-to-get-signed-url>", requestOptions);
    const data = await response.json();
    return decodeURIComponent(data.data.url);
  }
}

