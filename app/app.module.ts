import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import{MascaraDirective}from './mascara.directive';

@NgModule({
  imports: [BrowserModule],
  declarations: [
    AppComponent,
    MascaraDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
