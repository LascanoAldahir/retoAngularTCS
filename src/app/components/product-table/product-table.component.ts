import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent implements OnInit {
  private router = inject(Router);
  private productApi = inject(ApiService);

  searchText: string = '';
  pageSize: number = 5;

  products: Product[] = [];
  productosFiltrados: Product[] = [];

  productoAEliminar: Product | null = null;
  mostrarModal: boolean = false;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productApi.getAll().subscribe((data) => {
      this.products = data;
      this.actualizarFiltrados();
    });
  }

  actualizarFiltrados() {
    this.productosFiltrados = this.products
      .filter(p =>
        (p.nombre?.toLowerCase() ?? '').includes(this.searchText.toLowerCase()) ||
        (p.description?.toLowerCase() ?? '').includes(this.searchText.toLowerCase())
      )
      .slice(0, this.pageSize);
  }

  onSearchTextChange() {
    this.actualizarFiltrados();
  }

  onPageSizeChange() {
    this.actualizarFiltrados();
  }

  irAAgregar() {
    this.router.navigate(['/agregar']);
  }


  confirmarEliminacion(product: Product) {
    this.productoAEliminar = product;
    this.mostrarModal = true;
  }

  cancelarEliminacion() {
    this.productoAEliminar = null;
    this.mostrarModal = false;
  }

  edit(productId: string): void{
    this.router.navigate(['/editar', productId]);
  }

  eliminarConfirmado() {
    if (this.productoAEliminar) {
      this.productApi.delete(this.productoAEliminar.id).subscribe(() => {
        this.cargarProductos();
        this.cancelarEliminacion();
      });
    }
  }
}
