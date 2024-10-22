import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { Periodo } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-estado-de-cuenta',
  templateUrl: './estado-de-cuenta.component.html',
  styleUrls: ['./estado-de-cuenta.component.css']
})
export class EstadoDeCuentaComponent implements OnInit {
  loading: boolean = false;
  currentUser: any;
  fechasDisponibles: { fechaInicio: string; fechaFinal: string; periodo: string }[] = [];
  registrosFiltrados: any[] = [];
  fechaInicioSeleccionada: string | null = null;
  fechaFinalSeleccionada: string | null = null;
  periodo: string = '';
  registrosPorPagina: number = 50;
  paginaActual: number = 1;

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUsuarioLogueado();
    this.cargarFechasDisponibles();
  }

  onFechaCambio(): void {
    console.log('Fecha de inicio seleccionada:', this.fechaInicioSeleccionada);
    console.log('Fecha final seleccionada:', this.fechaFinalSeleccionada);
  }

  cargarFechasDisponibles(): void {
    this.authService.getPeriodos().subscribe((data: Periodo[]) => {
      this.fechasDisponibles = data.map(item => ({
        fechaInicio: item.FECHA_INICIO,
        fechaFinal: item.FECHA_FINAL,
        periodo: item.PERIODO
      }));
    });
  }

  consultarRegistros() {
    if (!this.fechaInicioSeleccionada || !this.fechaFinalSeleccionada) {
      this.toastr.warning('Por favor selecciona ambas fechas.', 'Fechas requeridas', {
        toastClass: 'ngx-toastr custom-toast',
        timeOut: 3000,
      });
      return;
    }

    const idTercero = this.currentUser.idTercero;

    console.log('Fechas seleccionadas:', this.fechaInicioSeleccionada, this.fechaFinalSeleccionada);
    console.log('ID del tercero:', idTercero);

    this.loading = true;
    this.registrosFiltrados = [];

    this.authService.consultarRegistros(this.fechaInicioSeleccionada, this.fechaFinalSeleccionada, idTercero).subscribe({
      next: (response) => {
        console.log('Registros obtenidos:', response);
        this.registrosFiltrados = response.detalles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al consultar registros:', err);
        this.toastr.error('Error al consultar registros', 'Error', {
          toastClass: 'ngx-toastr custom-toast'
        });
        this.loading = false;
      }
    });
  }

  generarPDF() {
    const toastRef = this.toastr.info('Generando PDF...', 'Proceso en curso', {
      disableTimeOut: true,
      closeButton: false,
      toastClass: 'ngx-toastr custom-toast'
    });

    this.cargarYPrepararTemplate().subscribe(template => {
      this.crearPDF(template).then(() => {
        this.toastr.clear(toastRef.toastId);

        this.toastr.success('PDF generado con éxito', 'Proceso completado', {
          toastClass: 'ngx-toastr custom-toast'
        });
      }).catch(error => {
        this.toastr.clear(toastRef.toastId);
        this.toastr.error('Error al generar PDF', 'Error', {
          toastClass: 'ngx-toastr custom-toast'
        });
      });
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
          const totalFormatted = Number(item.VALOR_TOTAL).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
          const valorPagadoFormatted = item.VALOR_PAGADO ? Number(item.VALOR_PAGADO).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '$ 0';
          return `
          <tr>
           <td style="padding: 0.03in; text-align: center;">${item.PERIODO}</td>
            <td style="padding: 0.03in; text-align: center;">${item.NOMBRE}</td>
            <td style="padding: 0.03in; text-align: center;">${item.NUMERO_OBLIGACION}</td>
            <td style="padding: 0.03in; text-align: center;">${totalFormatted}</td>
            <td style="padding: 0.03in; text-align: center;">${new Date(item.FECHA_VIGENCIA).toLocaleDateString()}</td>
            <td style="padding: 0.03in; text-align: center;">${valorPagadoFormatted}</td>
          </tr>
        `;
        }).join('');

        return template.replace('{{registros}}', registrosHTML);
      })
    );
  }

  crearPDF(template: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-10000px';
      container.style.width = '210mm';
      container.innerHTML = template;
      document.body.appendChild(container);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const marginX = 15;
      const marginY = 15;
      const pageHeight = 297 - marginY * 2;

      html2canvas(container, { scale: 2 }).then(canvas => {
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pageWidth = 210 - marginX * 2;

        const imgPageHeight = (canvas.height * pageWidth) / canvas.width;

        let position = 0;
        let remainingHeight = imgHeight;

        while (remainingHeight > 0) {
          const partHeight = Math.min(pageHeight * canvas.width / pageWidth, remainingHeight);
          const canvasPart = document.createElement('canvas');
          canvasPart.width = imgWidth;
          canvasPart.height = partHeight;

          const context = canvasPart.getContext('2d');
          if (context) {
            context.drawImage(canvas, 0, position, imgWidth, partHeight, 0, 0, imgWidth, partHeight);
          }

          const imgData = canvasPart.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', marginX, marginY, pageWidth, (partHeight * pageWidth) / imgWidth);

          remainingHeight -= partHeight;
          position += partHeight;

          if (remainingHeight > 0) {
            pdf.addPage();
          }
        }

        const pdfBlob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.click();

        document.body.removeChild(container);
        resolve();
      }).catch(reject);
    });
  }
}
