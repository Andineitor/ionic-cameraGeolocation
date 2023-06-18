import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
@Component({
  
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  loading: any;
  data: any[] = [];

  constructor(
    public photoService: PhotoService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}
  async ngOnInit() {
    console.log('listado init');
    this.loading = await this.loadingController.create();
    this.loading.present();
  
    this.photoService.getAllsLocations().subscribe({
      next: async result => {
        console.log('Result:', result); // Verifica el resultado obtenido
  
        this.data = result;
        await this.loading.dismiss();
      },
      error: e => console.log('Error:', e) // Muestra cualquier error que ocurra
    });
  }
  

  ngOnDestroy(): void {}

  async deleteData(data: any) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de eliminar esta imagen y geolocalización?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const { id, imageUrl } = data;
            await this.photoService.deleteImage(imageUrl);
            await this.photoService.deleteLocation(id);
            this.data = this.data.filter(item => item.id !== id);
          }
        }
      ]
    });

    await confirmAlert.present();
    await this.photoService.deleteImage(data.imageUrl); // Actualiza la llamada al método deleteImage

  }
  goToTab3() {
    this.router.navigate(['/tab3']);
  }
  goToHome() {
    this.router.navigate(['/home']);
  }
}