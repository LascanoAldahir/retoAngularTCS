import { NgModule } from "@angular/core";
import { AppComponent } from "../app.component";
import { BrowserModule } from "@angular/platform-browser";




export interface Product {
    id: string;
    nombre: string;
    description: string;
    logo: string;
    fechaLib: Date | string;
  fechaRev: Date | string;
}

// Agregar interface para validaciones
export interface ValidationResult {
  isValid: boolean;
  message: string;
}