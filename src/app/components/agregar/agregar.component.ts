import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationService, ValidationResult } from '../../services/validation.service'; // ← IMPORTAR
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent {
  product: Product = {
    id: '',
    nombre: '',
    description: '',
    logo: '',
    fechaLib: new Date(),
    fechaRev: new Date()
  };

  showErrors = false;

   // ← AGREGAR ESTAS PROPIEDADES PARA VALIDACIONES
  validationErrors: { [key: string]: string } = {};
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private validationService: ValidationService // ← INYECTAR SERVICIO
  ) {}

   // ← AGREGAR MÉTODOS DE VALIDACIÓN
  validateField(fieldName: string, value: any): void {
    let validation: ValidationResult;
    
    switch (fieldName) {
      case 'id':
        validation = this.validationService.validateId(value);
        break;
      case 'nombre':
        validation = this.validationService.validateNombre(value);
        break;
      case 'description':
        validation = this.validationService.validateDescripcion(value);
        break;
      case 'logo':
        validation = this.validationService.validateLogoUrl(value);
        break;
      case 'fechaLib':
        validation = this.validationService.validateFecha(value, 'liberacion');
        break;
      case 'fechaRev':
        validation = this.validationService.validateFechaRevision(this.product.fechaLib, value);
        break;
      default:
        validation = { isValid: true, message: '' };
    }
    
    if (validation.isValid) {
      delete this.validationErrors[fieldName];
    } else {
      this.validationErrors[fieldName] = validation.message;
    }
  }


  // ← MÉTODO PARA VALIDAR EN TIEMPO REAL
  onFieldChange(fieldName: string, value: any): void {
    this.validateField(fieldName, value);
  }


  enviarFormulario(): void {
    this.isSubmitting = true;
    this.showErrors = true;
    
    // Validar todos los campos
    this.validateField('id', this.product.id);
    this.validateField('nombre', this.product.nombre);
    this.validateField('description', this.product.description);
    this.validateField('logo', this.product.logo);
    this.validateField('fechaLib', this.product.fechaLib);
    this.validateField('fechaRev', this.product.fechaRev);
    
    // Si hay errores de validación, no enviar
    if (Object.keys(this.validationErrors).length > 0) {
      this.isSubmitting = false;
      return;
    }

    // Si todo está bien, enviar al servidor
    this.apiService.create(this.product).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al crear el producto:', error);
        this.isSubmitting = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
