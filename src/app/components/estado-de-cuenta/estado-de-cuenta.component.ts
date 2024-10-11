// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { map } from 'rxjs';

// @Component({
//   selector: 'app-estado-de-cuenta',
//   templateUrl: './estado-de-cuenta.component.html',
//   styleUrls: ['./estado-de-cuenta.component.css']
// })
// export class EstadoDeCuentaComponent {
//   currentUser = {
//     usuario: 'Juan Pérez',
//     empresa: 'Empresa XYZ'
//   };

//   fechasDisponibles: string[] = [
//     '2024-01-01',
//     '2024-02-01',
//     '2024-02-01',
//     '2024-03-01',
//     '2024-04-01',
//     '2024-05-01'
//   ];

//   fechaInicioSeleccionada: string | null = null;
//   fechaFinalSeleccionada: string | null = null;
//   registrosPorPagina: number = 2; 
//   paginaActual: number = 1; 
//   periodo: string = '';
//   fechaActual: string = new Date().toLocaleDateString();


//   estadoCuenta = [
//     {
//       concepto: 'Servicio de Agua',
//       numeroRecibo: '001234',
//       total: 50000,
//       fechaPagado: new Date('2024-01-10'),
//       valorPagado: 50000
//     },
//     {
//       concepto: 'Servicio de Luz',
//       numeroRecibo: '001235',
//       total: 75000,
//       fechaPagado: new Date('2024-02-15'),
//       valorPagado: 75000
//     },
//     {
//       concepto: 'Servicio de Gas',
//       numeroRecibo: '001236',
//       total: 45000,
//       fechaPagado: new Date('2024-03-05'),
//       valorPagado: 45000
//     }
//   ];

//   registrosFiltrados: any[] = [];

//   constructor(private http: HttpClient) {}

//   calcularPeriodo() {
//     if (this.fechaInicioSeleccionada && this.fechaFinalSeleccionada) {
//       const fechaInicio = new Date(this.fechaInicioSeleccionada);
//       const fechaFinal = new Date(this.fechaFinalSeleccionada);

//       if (fechaInicio <= fechaFinal) {
//         const mesInicio = fechaInicio.getMonth() + 1;
//         const anioInicio = fechaInicio.getFullYear();

//         const mesString = mesInicio < 10 ? '0' + mesInicio : mesInicio.toString();

//         this.periodo = `${anioInicio}-${mesString}`;
//       } else {
//         this.periodo = 'Fechas inválidas';
//       }
//     } else {
//       this.periodo = '';
//     }
//   }

//   consultarRegistros() {
//     if (this.fechaInicioSeleccionada && this.fechaFinalSeleccionada) {
//       const fechaInicio = new Date(this.fechaInicioSeleccionada);
//       const fechaFinal = new Date(this.fechaFinalSeleccionada);

//       this.registrosFiltrados = this.estadoCuenta.filter(item => {
//         return item.fechaPagado >= fechaInicio && item.fechaPagado <= fechaFinal;
//       });

//       this.paginaActual = 1;
//     } else {
//       this.registrosFiltrados = [...this.estadoCuenta];
//       this.paginaActual = 1;
//     }
//   }

//   generarPDF() {
//     this.cargarYPrepararTemplate().subscribe(template => {
//         this.crearPDF(template);
//     });
// }

// cargarYPrepararTemplate() {
//     return this.http.get('assets/reporte-template.html', { responseType: 'text' }).pipe(
//         map(template => {
         
//             template = template
//                 .replace('{{empresa}}', this.currentUser.empresa)
//                 .replace('{{periodo}}', this.periodo)
//                 .replace('{{fechaInicio}}', this.fechaInicioSeleccionada || '')
//                 .replace('{{fechaFinal}}', this.fechaFinalSeleccionada || '')
//                 .replace('{{fechaActual}}', new Date().toLocaleDateString());
       
//             const registrosHTML = this.registrosFiltrados.map(item => {
//                 const totalFormatted = Number(item.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
//                 const valorPagadoFormatted = Number(item.valorPagado).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
//                 return `
//                     <tr>
//                         <td style=" padding: 0.03in; text-align: center;">${item.concepto}</td>
//                         <td style=" padding: 0.03in; text-align: center;">${item.numeroRecibo}</td>
//                         <td style=" padding: 0.03in; text-align: center;">${totalFormatted}</td>
//                         <td style=" padding: 0.03in; text-align: center;">${new Date(item.fechaPagado).toLocaleDateString()}</td>
//                         <td style=" padding: 0.03in; text-align: center;">${valorPagadoFormatted}</td>
//                     </tr>
//                 `;
//             }).join('');

//             return template.replace('{{registros}}', registrosHTML);
//         })
//     );
// }

// crearPDF(template: string) {
//     const container = document.createElement('div');
//     container.style.position = 'fixed';
//     container.style.top = '-10000px'; 
//     container.style.width = '210mm';
//     container.innerHTML = template; 
//     document.body.appendChild(container);

//     html2canvas(container, { scale: 2 }).then(canvas => {
//         const imgData = canvas.toDataURL('image/png');
//         const pdf = new jsPDF('p', 'mm', 'a4');

//         const marginX = 15;
//         const marginY = 15;
//         const pageWidth = 210 - marginX * 2;
//         const pageHeight = 297 - marginY * 2;
//         const imgWidth = canvas.width;
//         const imgHeight = canvas.height;
//         const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
//         const finalWidth = imgWidth * scaleFactor;
//         const finalHeight = imgHeight * scaleFactor;

//         pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);

//         const pdfBlob = pdf.output('blob');
//         const blobUrl = URL.createObjectURL(pdfBlob);

//         const link = document.createElement('a');
//         link.href = blobUrl;
//         link.target = '_blank';
//         link.click();

//         document.body.removeChild(container);
//     });
// }

  
// }

import { Component, OnInit } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
// import { AuthService } from '../services/auth.service'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { map } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { Periodo } from 'src/app/models/user.model';

@Component({
  selector: 'app-estado-de-cuenta',
  templateUrl: './estado-de-cuenta.component.html',
  styleUrls: ['./estado-de-cuenta.component.css']
})
export class EstadoDeCuentaComponent implements OnInit {
  currentUser: any; // Cambia a tipo más específico según tu modelo
  fechasDisponibles: { fechaInicio: string; fechaFinal: string; periodo: string }[] = [];

  estadoCuenta = [
    {
      concepto: 'Servicio de Agua',
      numeroRecibo: '001234',
      total: 50000,
      fechaPagado: '2024-01-10', // Puede ser cadena o Date
      valorPagado: 50000
    },
    {
      concepto: 'Servicio de Luz',
      numeroRecibo: '001235',
      total: 75000,
      fechaPagado: '2024-10-10',
      valorPagado: 75000
    },
    {
      concepto: 'Servicio de Gas',
      numeroRecibo: '001236',
      total: 45000,
      fechaPagado: '2024-03-05',
      valorPagado: 45000
    }
  ];
  

  fechaInicioSeleccionada: string | null = null;
  fechaFinalSeleccionada: string | null = null;
  registrosPorPagina: number = 2; 
  paginaActual: number = 1; 
  periodo: string = '';
  registrosFiltrados: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUsuarioLogueado(); // Obtener usuario logueado
    this.cargarFechasDisponibles(); // Cargar fechas disponibles
  }
  cargarFechasDisponibles(): void {
    this.authService.getPeriodos().subscribe((data: Periodo[]) => {
      console.log(data); // Muestra la estructura de los datos en la consola
      // Asignar solo las fechas de inicio y final a fechasDisponibles
      this.fechasDisponibles = data.map(item => ({
        fechaInicio: item.FECHA_INICIO,
        fechaFinal: item.FECHA_FINAL,
        periodo: item.PERIODO // Opcional, si quieres mostrar el periodo
      }));
    });
  }

  onFechaCambio() {
    console.log("Fecha Inicio Seleccionada:", this.fechaInicioSeleccionada);
    console.log("Fecha Final Seleccionada:", this.fechaFinalSeleccionada);
    this.calcularPeriodo(); // Actualiza el periodo al cambiar fechas
  }

  
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
  // consultarRegistros() {
  //   if (this.fechaInicioSeleccionada && this.fechaFinalSeleccionada) {
  //     const fechaInicio = new Date(this.fechaInicioSeleccionada);
  //     const fechaFinal = new Date(this.fechaFinalSeleccionada);

  //     this.registrosFiltrados = this.estadoCuenta.filter(item => {
  //       const fechaPagado = new Date(item.fechaPagado); // Asegúrate de que `fechaPagado` sea un objeto Date
  //       return fechaPagado >= fechaInicio && fechaPagado <= fechaFinal;
  //     });
  //     console.log('Registros filtrados:', this.registrosFiltrados);
  //     this.paginaActual = 1; // Resetea la paginación
  //   } else {
  //     this.registrosFiltrados = [...this.estadoCuenta];
  //     console.log('Todos los registros:', this.registrosFiltrados);
  //     this.paginaActual = 1; // Resetea la paginación
  //   }
  // }
  // consultarRegistros() {
  //   if (this.fechaInicioSeleccionada && this.fechaFinalSeleccionada) {
  //     const fechaInicio = new Date(this.fechaInicioSeleccionada);
  //     const fechaFinal = new Date(this.fechaFinalSeleccionada);
  
  //     // Crear fechas sin considerar las horas
  //     const fechaInicioSinHora = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
  //     const fechaFinalSinHora = new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate());
  
  //     console.log('Fecha Inicio Seleccionada (sin hora):', fechaInicioSinHora);
  //     console.log('Fecha Final Seleccionada (sin hora):', fechaFinalSinHora);
  
  //     this.registrosFiltrados = this.estadoCuenta.filter(item => {
  //       const fechaPagado = new Date(item.fechaPagado);
  
  //       // Crear fecha pagado sin horas
  //       const fechaPagadoSinHora = new Date(fechaPagado.getFullYear(), fechaPagado.getMonth(), fechaPagado.getDate());
  
  //       console.log(`Comparando ${fechaPagadoSinHora} con ${fechaInicioSinHora} y ${fechaFinalSinHora}`);
  
  //       // Compara las fechas ignorando las horas
  //       return fechaPagadoSinHora >= fechaInicioSinHora && fechaPagadoSinHora <= fechaFinalSinHora;
  //     });
  
  //     console.log('Registros filtrados:', this.registrosFiltrados);
  //   } else {
  //     this.registrosFiltrados = [...this.estadoCuenta];
  //     console.log('Todos los registros:', this.registrosFiltrados);
  //   }
  //   this.paginaActual = 1;
  // }
  consultarRegistros() {
    if (this.fechaInicioSeleccionada && this.fechaFinalSeleccionada) {
        const fechaInicio = new Date(this.fechaInicioSeleccionada);
        const fechaFinal = new Date(this.fechaFinalSeleccionada);

        // Crear fechas sin considerar las horas
        const fechaInicioSinHora = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
        const fechaFinalSinHora = new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate());

        console.log('Fecha Inicio Seleccionada (sin hora):', fechaInicioSinHora);
        console.log('Fecha Final Seleccionada (sin hora):', fechaFinalSinHora);

        this.registrosFiltrados = this.estadoCuenta.filter(item => {
            const fechaPagado = new Date(item.fechaPagado);
            const fechaPagadoSinHora = new Date(fechaPagado.getFullYear(), fechaPagado.getMonth(), fechaPagado.getDate());

            console.log(`Comparando ${fechaPagadoSinHora} con ${fechaInicioSinHora} y ${fechaFinalSinHora}`);

           
            return fechaPagadoSinHora >= fechaInicioSinHora && fechaPagadoSinHora <= fechaFinalSinHora;
        });

        console.log('Registros filtrados:', this.registrosFiltrados);
    } else {
     
        this.registrosFiltrados = [];
        console.log('Por favor selecciona ambas fechas.');
    }
    this.paginaActual = 1; 
  }

  generarPDF() {
    this.cargarYPrepararTemplate().subscribe(template => {
      this.crearPDF(template);
    });
  }

  cargarYPrepararTemplate() {
    return this.http.get('assets/reporte-template.html', { responseType: 'text' }).pipe(
      map(template => {
        template = template
          .replace('{{empresa}}', this.currentUser.empresa)
          .replace('{{periodo}}', this.periodo)
          .replace('{{fechaInicio}}', this.fechaInicioSeleccionada || '')
          .replace('{{fechaFinal}}', this.fechaFinalSeleccionada || '')
          .replace('{{fechaActual}}', new Date().toLocaleDateString());

        const registrosHTML = this.registrosFiltrados.map(item => {
          const totalFormatted = Number(item.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
          const valorPagadoFormatted = Number(item.valorPagado).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
          return `
            <tr>
              <td style="padding: 0.03in; text-align: center;">${item.concepto}</td>
              <td style="padding: 0.03in; text-align: center;">${item.numeroRecibo}</td>
              <td style="padding: 0.03in; text-align: center;">${totalFormatted}</td>
              <td style="padding: 0.03in; text-align: center;">${new Date(item.fechaPagado).toLocaleDateString()}</td>
              <td style="padding: 0.03in; text-align: center;">${valorPagadoFormatted}</td>
            </tr>
          `;
        }).join('');

        return template.replace('{{registros}}', registrosHTML);
      })
    );
  }

  crearPDF(template: string) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px'; 
    container.style.width = '210mm';
    container.innerHTML = template; 
    document.body.appendChild(container);

    html2canvas(container, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const marginX = 15;
      const marginY = 15;
      const pageWidth = 210 - marginX * 2;
      const pageHeight = 297 - marginY * 2;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const finalWidth = imgWidth * scaleFactor;
      const finalHeight = imgHeight * scaleFactor;

      pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.target = '_blank';
      link.click();

      document.body.removeChild(container);
    });
  }
}
