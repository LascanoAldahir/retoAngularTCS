import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';

////Define como se va a llamar al componente en HTML
@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
//PROPIEDADES DEL COMPONENTE
export class ProductTableComponent implements OnInit {
  //Servicios inyectados para navegación y comunicación con API
  private router = inject(Router);
  private productApi = inject(ApiService);

  //Almacena el texto que el usuario escribe en el buscador
  searchText: string = '';
  
  //Numero de productos por pagina
  pageSize: number = 5;
//Array con todos los productos
  products: Product[] = [];
  productosFiltrados: Product[] = [];

  productoAEliminar: Product | null = null;
  mostrarModal: boolean = false;

  //Lama al metodo para cargar productos desde la API 
  ngOnInit(): void {
    this.cargarProductos();
  }

//Llama al método getAll() del servicio ApiServer
  cargarProductos() {
    //Se suscribe al observable para recibir los datos
    this.productApi.getAll().subscribe((data) => {
      //almacena los productos en la propiedad producs
      this.products = data;
      //Llama a este metodo para mostrar los productos
      this.actualizarFiltrados();
    });
  }

//Filtra los productos basandose
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
