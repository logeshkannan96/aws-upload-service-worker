import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  title = 'screenrecorder';
}
