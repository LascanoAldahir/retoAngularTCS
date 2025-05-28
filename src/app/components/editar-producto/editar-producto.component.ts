import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { ValidationService, ValidationResult } from '../../services/validation.service'; // ← IMPORTAR
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditarProductoComponent implements OnInit {
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
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService // ← INYECTAR SERVICIO
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getById(id).subscribe(
        (data) => {
          this.product = data;
          if (typeof this.product.fechaLib === 'string') {
            this.product.fechaLib = new Date(this.product.fechaLib);
          }
          if (typeof this.product.fechaRev === 'string') {
            this.product.fechaRev = new Date(this.product.fechaRev);
          }
        },
        (error) => {
          console.error('Error al cargar el producto:', error);
          this.router.navigate(['/']);
        }
      );
    }
  }

  // ← AGREGAR MÉTODOS DE VALIDACIÓN
  validateField(fieldName: string, value: any): void {
    let validation: ValidationResult;
    
    switch (fieldName) {
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

  guardarCambios(): void {
    this.isSubmitting = true;
    this.showErrors = true;
    
    // Validar todos los campos (excepto ID que está deshabilitado)
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
    this.apiService.update(this.product).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
        this.isSubmitting = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}