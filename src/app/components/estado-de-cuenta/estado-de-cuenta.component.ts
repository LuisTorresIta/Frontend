import { Component } from '@angular/core';

@Component({
  selector: 'app-estado-de-cuenta',
  templateUrl: './estado-de-cuenta.component.html',
  styleUrls: ['./estado-de-cuenta.component.css']
})
export class EstadoDeCuentaComponent {
  currentUser = {
    usuario: 'Juan Pérez',
    empresa: 'Empresa XYZ'
  };

  fechasDisponibles: string[] = [
    '2024-01-01',
    '2024-02-01',
    '2024-03-01',
    '2024-04-01',
    '2024-05-01'
  ];

  fechaInicioSeleccionada: string | null = null;
  fechaFinalSeleccionada: string | null = null;
  registrosPorPagina: number = 2; 
  paginaActual: number = 1; 

  periodo: string = '';

  estadoCuenta = [
    {
      concepto: 'Servicio de Agua',
      numeroRecibo: '001234',
      total: 50000,
      fechaPagado: new Date('2024-01-10'),
      valorPagado: 50000
    },
    {
      concepto: 'Servicio de Luz',
      numeroRecibo: '001235',
      total: 75000,
      fechaPagado: new Date('2024-02-15'),
      valorPagado: 75000
    },
    {
      concepto: 'Servicio de Gas',
      numeroRecibo: '001236',
      total: 45000,
      fechaPagado: new Date('2024-03-05'),
      valorPagado: 45000
    },
  ];

  registrosFiltrados: any[] = [];

  calcularPeriodo() {
    if (this.fechaInicioSeleccionada && this.fechaFinalSeleccionada) {
      const fechaInicio = new Date(this.fechaInicioSeleccionada);
      const fechaFinal = new Date(this.fechaFinalSeleccionada);

      if (fechaInicio <= fechaFinal) {
        const mesInicio = fechaInicio.getMonth() + 1; 
        const anioInicio = fechaInicio.getFullYear();

        const mesString = mesInicio < 10 ? '0' + mesInicio : mesInicio.toString();

        this.periodo = `${anioInicio}-${mesString}`;
      } else {
        this.periodo = 'Fechas inválidas';
      }
    } else {
      this.periodo = '';
    }
  }

  consultarRegistros() {
    if (this.fechaInicioSeleccionada && this.fechaFinalSeleccionada) {
      const fechaInicio = new Date(this.fechaInicioSeleccionada);
      const fechaFinal = new Date(this.fechaFinalSeleccionada);

      this.registrosFiltrados = this.estadoCuenta.filter(item => {
        return item.fechaPagado >= fechaInicio && item.fechaPagado <= fechaFinal;
      });

      this.paginaActual = 1;
    } else {
      this.registrosFiltrados = [...this.estadoCuenta];
      this.paginaActual = 1;
    }
  }
}
