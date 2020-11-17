import { Component } from '@angular/core';
import { ImagesService } from './services/images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'electron-angular-demo';

  constructor(private imageService: ImagesService) { }

  ngOnInit(): void {
    this.imageService.navigateDirectory('.');
  }
}
