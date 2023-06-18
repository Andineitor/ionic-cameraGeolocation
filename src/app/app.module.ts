import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    provideFirebaseApp(() => initializeApp({
    apiKey: "AIzaSyAm3ODw1tL7fBVyt3YhjiH2K07mWPOKnHc",
    authDomain: "geolocationwhitcamera.firebaseapp.com",
    projectId: "geolocationwhitcamera",
    storageBucket: "geolocationwhitcamera.appspot.com",
    messagingSenderId: "419859119396",
    appId: "1:419859119396:web:b7a716c42743112a68c7b1",
    measurementId: "G-Q15XHP6GRZ"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
