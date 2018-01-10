import { ColorPickerComponent } from './color-picker/color-picker';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DrawBoardComponent } from './draw-board/draw-board';
import { PhotoGalleryComponent } from "./photo-gallery/photo-gallery";

@NgModule({
  declarations: [
    AppComponent, DrawBoardComponent, ColorPickerComponent, PhotoGalleryComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
