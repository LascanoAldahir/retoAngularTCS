import { Routes } from '@angular/router';
import { AgregarComponent } from './components/agregar/agregar.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { Head } from 'rxjs';
import { ProductComponent } from './pages/product/product.component';
import { EditarProductoComponent } from './components/editar-producto/editar-producto.component';


export const routes: Routes = [
    {
        path: '', component: ProductTableComponent
    },
    {
        path: 'agregar' , component: AgregarComponent
    },
    {
        path: 'back' , component: ProductTableComponent
    },
    {
        path: 'editar/:id', component: EditarProductoComponent
    },
    {
        path: '**' , redirectTo: '' 
    }
];
