import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ImagesService } from '../services/images.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images: string[];
  directory: string[];

  constructor(private imageService: ImagesService, private cdr: ChangeDetectorRef, private tokenServ: TokenService) { }

  ngOnInit() {
    this.imageService.images.subscribe((value) => {
      this.images = value;
      this.cdr.detectChanges();
    });

    this.imageService.directory.subscribe((value) => {
      this.directory = value;
      this.cdr.detectChanges();
    });
  }

  navigateDirectory(path) {
    this.imageService.navigateDirectory(path);
  }

  loginWithToken() {
    console.log('get token info');
    this.tokenServ.requestToken();
  }

}
