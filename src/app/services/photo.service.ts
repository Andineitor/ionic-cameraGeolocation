import { Injectable, NgZone } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Firestore, collectionData } from '@angular/fire/firestore';

import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, Storage, uploadString,deleteObject } from '@angular/fire/storage';
import { deleteDoc } from 'firebase/firestore';
export interface UserPhoto {
  latitude:number;
  longitude:number
}
@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];

  constructor(private zone: NgZone,
    private firestore: Firestore,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private storage: Storage) {

  }


  public async addNewToGallery() {

    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    let confirmation = false;
    
    const loading = await this.loadingController.create();
    await loading.present();

    if (capturedPhoto) {
      const id: any = await this.createPosition();
      if (id) {
        confirmation = await this.uploadImage(capturedPhoto, id.id);
      }
    }

    await loading.dismiss();

    if (confirmation) {
      this.showAlert('Exitoso', 'Datos guardados correctamente!!');
    } else {
      this.showAlert('Error', 'Algo a fallado!!');
    }

  }

  async createPosition() {
    const location = await this.watchPosition();
    const create = this.createInFirebase(location);

    try {
      const result = await create;
      return result;
    } catch (e) {
      console.log(e);
    }

  }


  async createInFirebase(location: any) {
    const locationCollection = collection(this.firestore, 'location');
    const docRef = await addDoc(locationCollection, location);
    const docData = {
      id: docRef.id,
      ...location
    };
    return docData;
  }

  watchPosition() {
    return new Promise((resolve, reject) => {
      const watchId: any = Geolocation.getCurrentPosition().then((position) => {
        this.zone.run(() => {
          const data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(data);
        });
      }).catch((error) => {
        console.error(error);
        reject(error);
      });

      const errorCallback = (error: any) => {
        console.error(error);
        reject(error);
      };

      Geolocation.getCurrentPosition().then(() => {
        Geolocation.clearWatch({ id: watchId });
      }).catch(errorCallback);
    });
  }

  async uploadImage(cameraFile: Photo, id: any) {
    const path = `images/${id}.webp`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, String(cameraFile.base64String), 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(this.firestore, `images/${id}`);
      await setDoc(userDocRef, {
        imageUrl
      });
      console.log('Subido!!!');
      return true;
    } catch (e) {
      return false;
    }

  }


  async getAllImages(): Promise<string[]> {
    const imageUrls: string[] = [];

    try {
      const imageCollectionRef = collection(this.firestore, 'images');
      const querySnapshot = await getDocs(imageCollectionRef);
      for (const doc of querySnapshot.docs) {
        const data: any = doc.data();
        if (data.imageUrl) {
          imageUrls.push(data.imageUrl);
        }
      }
      return imageUrls;
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
      return [];
    }
  }

  getAllsLocations() {
    const carsCollection = collection(this.firestore, 'location');
    return collectionData(carsCollection, { idField: 'id' });
  }

  async showAlert(header: any, message: any) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
  
  async deleteLocation(id: string): Promise<void> {
    try {
      const locationDocRef = doc(this.firestore, 'location', id);
      await deleteDoc(locationDocRef);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  }
}