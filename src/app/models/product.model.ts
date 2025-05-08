import { NgModule } from "@angular/core";
import { AppComponent } from "../app.component";
import { BrowserModule } from "@angular/platform-browser";




export interface Product {
    id: string;
    nombre: string;
    description: string;
    logo: string;
    fechaLib: Date;
    fechaRev: Date;
}