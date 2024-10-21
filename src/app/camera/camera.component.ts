import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})

export class CameraComponent {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef;
  videoStream: MediaStream | null = null;
  videoDevices: MediaDeviceInfo[] = [];
  deviceId: string = '';

  ngOnInit() {
    this.getVideoDevices();
  }

  changeCamera(target:any) {
    this.deviceId = target.value;
  }

  getVideoDevices() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        this.videoDevices = devices.filter(device => device.kind === 'videoinput');
      })
      .catch(err => {
        console.error('Error enumerating devices: ', err);
      });
  }

  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const videoConstraints: MediaTrackConstraints = {
        deviceId: this.deviceId ? { exact: this.deviceId } : undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };
      
      navigator.mediaDevices.getUserMedia({ video: videoConstraints })
        .then((stream) => {
          this.videoStream = stream;
          this.videoElement.nativeElement.srcObject = stream;
        })
        .catch(err => {
          console.error('Error accessing camera: ', err);
        });
    } else {
      console.error('getUserMedia is not supported in this browser.');
    }
  }

  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  }

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }

  openFullScreen() {
    window.open(
      'https://www.google.com', 
      'popup', 
      'width=' + screen.width + ',height=' + screen.height
    );
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
