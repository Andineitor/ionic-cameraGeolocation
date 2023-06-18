import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit,OnDestroy {

  constructor(public photoService: PhotoService,private router: Router) { }

  async ngOnInit() {
    console.log('New foto init');
  }

  ngOnDestroy(): void {
    console.log('New foto destrooy');
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
  goToTab1() {
    this.router.navigate(['/tab1']);
  }
  goToHome() {
    this.router.navigate(['/home']);
  }
}