import { Injectable } from '@angular/core';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // Validación para ID (solo números, máximo 10 dígitos)
  validateId(id: string): ValidationResult {
    if (!id || id.trim() === '') {
      return { isValid: false, message: 'El ID es requerido' };
    }
    
    if (!/^\d+$/.test(id)) {
      return { isValid: false, message: 'El ID solo puede contener números' };
    }
    
    if (id.length < 1 || id.length > 10) {
      return { isValid: false, message: 'El ID debe tener entre 1 y 10 dígitos' };
    }
    
    return { isValid: true, message: '' };
  }

  // Validación para nombre (solo letras, espacios y algunos caracteres especiales)
  validateNombre(nombre: string): ValidationResult {
    if (!nombre || nombre.trim() === '') {
      return { isValid: false, message: 'El nombre es requerido' };
    }
    
    if (nombre.trim().length < 2) {
      return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
    }
    
    if (nombre.trim().length > 100) {
      return { isValid: false, message: 'El nombre no puede exceder 100 caracteres' };
    }
    
    // Solo permite letras, espacios, guiones y algunos caracteres especiales
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\_\.]+$/.test(nombre)) {
      return { isValid: false, message: 'El nombre solo puede contener letras, espacios y guiones' };
    }
    
    return { isValid: true, message: '' };
  }

  // Validación para descripción
  validateDescripcion(descripcion: string): ValidationResult {
    if (!descripcion || descripcion.trim() === '') {
      return { isValid: false, message: 'La descripción es requerida' };
    }
    
    if (descripcion.trim().length < 10) {
      return { isValid: false, message: 'La descripción debe tener al menos 10 caracteres' };
    }
    
    if (descripcion.trim().length > 500) {
      return { isValid: false, message: 'La descripción no puede exceder 500 caracteres' };
    }
    
    return { isValid: true, message: '' };
  }

  // Validación para URL del logo
  validateLogoUrl(url: string): ValidationResult {
    if (!url || url.trim() === '') {
      return { isValid: false, message: 'La URL del logo es requerida' };
    }
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      return { isValid: false, message: 'Ingrese una URL válida' };
    }
    
    // Verificar que la URL termine en extensión de imagen
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
    if (!imageExtensions.test(url)) {
      return { isValid: false, message: 'La URL debe apuntar a una imagen válida (.jpg, .png, .gif, etc.)' };
    }
    
    return { isValid: true, message: '' };
  }

  // Validación para fechas
  validateFecha(fecha: string | Date, tipo: 'liberacion' | 'revision'): ValidationResult {
    if (!fecha) {
      return { isValid: false, message: `La fecha de ${tipo} es requerida` };
    }
    
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    
    if (isNaN(fechaObj.getTime())) {
      return { isValid: false, message: 'Fecha inválida' };
    }
    
    // La fecha de liberación no puede ser futura
    if (tipo === 'liberacion' && fechaObj > hoy) {
      return { isValid: false, message: 'La fecha de liberación no puede ser futura' };
    }
    
    return { isValid: true, message: '' };
  }

  // Validación para fecha de revisión en función de fecha de liberación
  validateFechaRevision(fechaLib: string | Date, fechaRev: string | Date): ValidationResult {
    const basicValidation = this.validateFecha(fechaRev, 'revision');
    if (!basicValidation.isValid) {
      return basicValidation;
    }
    
    const fechaLibObj = new Date(fechaLib);
    const fechaRevObj = new Date(fechaRev);
    
    // La fecha de revisión debe ser posterior a la fecha de liberación
    if (fechaRevObj <= fechaLibObj) {
      return { isValid: false, message: 'La fecha de revisión debe ser posterior a la fecha de liberación' };
    }
    
    return { isValid: true, message: '' };
  }
}