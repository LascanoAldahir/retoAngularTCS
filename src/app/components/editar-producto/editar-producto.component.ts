import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { Product } from '../../models/product.model';
import { error } from 'console';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class EditarProductoComponent implements OnInit {
  product: Product = {
    id: '',
    nombre: '',
    logo: '',
    description: '',
    fechaLib: new Date(),
    fechaRev: new Date()
  };
  showErrors = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Obtener ID del producto de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      //Cargar los datos del producto desde el servicio
      this.apiService.getById(id).subscribe(
        (data) => {
          this.product = data;
          //Convertir las fechas de string a date si es necesario
          this.product.fechaLib = new Date(this.product.fechaLib);
          this.product.fechaLib = new Date(this.product.fechaRev);
        },
        (error) => {
          console.error('Error al cargar el producto:', error);
          //Redirigir a la tabla de productos si hay un error
          this.router.navigate(['/']);
        }
      );
    }
  }

  guardarCambios(): void {
    //Validar que todos los campos requeridos esten completos
    if (!this.product.id ||
      !this.product.nombre ||
      !this.product.description ||
      !this.product.logo ||
      !this.product.fechaLib ||
      !this.product.fechaRev ) {
      this.showErrors = true;
        return;
      }

      //Envar los cambios al servicio
      this.apiService.update(this.product).subscribe(
        () => {
          //Redirigir a la tabla de productos despues de actualizar
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error al actualizar:', error);
        }
      );
    }
    cancelar(): void {
      //Redirigir a la tabla de productos sin hacer cambios
      this.router.navigate(['/']);
    }
  }
