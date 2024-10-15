import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import * as JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-liquidation',
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.css']
})
export class LiquidationComponent implements OnInit {
  @ViewChild('consolidadoForm') consolidadoForm!: NgForm;
  periodos: any[] = [];
  periodoSeleccionado: any;
  fechaInicio: string = '';
  fechaFinal: string = '';
  isFormSubmitted: boolean = false;
  invoiceNumber1 = '0000000023';
  invoiceNumber2 = '0000000024';
  invoiceNumber3 = '0000000025';
  successMessage: string = '';

  usuario = {
    empresa: '',
    periodo: ''
  };

  movilizacion = {
    reporteEntradas: 0,
    noNovedades: 0,
    baseLiquidacion: 0
  };

  liquidation = {
    aportesFet: 0,
    aportesFQ: 0,
    aportesAMB: 0,
    total: 0
  };

  fechaEmision: Date = new Date();
  fechaVencimiento: Date = new Date();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadUserData();
  }

  ngOnInit(): void {
    this.authService.getPeriodos().subscribe((data: any) => {
      this.periodos = data;
    });
  }

  loadUserData() {
    const usuarioLogueado = this.authService.getUsuarioLogueado();
    if (usuarioLogueado) {
      this.usuario.empresa = usuarioLogueado.empresa;
    }
  }

  porcentajeLimite: number = 0.13;

  validateData(): boolean {
    const { reporteEntradas, baseLiquidacion } = this.movilizacion;
    const diferencia = reporteEntradas - baseLiquidacion;
    const limite = this.porcentajeLimite * reporteEntradas;

    if (diferencia > limite) {
      alert('Verifique su información.');
      return false;
    }
    return true;
  }

  // Método para calcular el valor de base liquidacion y los aportes
  updateCalculations() {
    this.movilizacion.baseLiquidacion = this.movilizacion.reporteEntradas - this.movilizacion.noNovedades;
    this.calculateLiqFields();
  }

  // Método para calcular los valores de los campos en la sección Liquidacion
  calculateLiqFields() {
    const campo3 = this.movilizacion.baseLiquidacion;
    this.liquidation.aportesFet = campo3 * 200;
    this.liquidation.aportesFQ = campo3 * 50;
    this.liquidation.aportesAMB = campo3 * 25.65;
    this.liquidation.total = this.liquidation.aportesFet + this.liquidation.aportesFQ + this.liquidation.aportesAMB;
  }

  // Método para formatear los valores como moneda
  formatAsCurrency(value: number): string {
    return `$ ${value.toLocaleString('es-CO')}`;
  }

  formatAsThousands(value: number): string {
    return value.toLocaleString('es-CO');
  }

  onPeriodoChange(event: any) {
    const periodoSeleccionado = event.target.value;
    const periodo = this.periodos.find(p => p.PERIODO.toString() === periodoSeleccionado);
    if (periodo) {
      this.fechaInicio = periodo.FECHA_INICIO;
      this.fechaFinal = periodo.FECHA_FINAL;
      this.usuario.periodo = periodo.PERIODO;
    } else {
      this.fechaInicio = '';
      this.fechaFinal = '';
      this.usuario.periodo = ''
    }
  }

  setFechasPorPeriodo() {
    this.fechaEmision = new Date();
    this.fechaVencimiento = new Date();
  }

  logo: string = 'assets/amb.png';

  onSubmit() {
    if (this.isFormSubmitted) {
      return;
    }

    if (this.validateData()) {
      // Recopilar los datos del formulario
      const usuarioLogueado = this.authService.getUsuarioLogueado();
      const registroData = {
        usuario: usuarioLogueado,
        aportesFet: this.liquidation.aportesFet,
        aportesFQ: this.liquidation.aportesFQ,
        aportesAMB: this.liquidation.aportesAMB,
        fechaEmision: this.fechaEmision,
        numeroFacturaPDF1: this.invoiceNumber1,
        numeroFacturaPDF2: this.invoiceNumber2,
        numeroFacturaPDF3: this.invoiceNumber3
      };


      this.authService.saveRecord(registroData).subscribe(
        (response) => {
          console.log('Registro guardado exitosamente:', response);
          this.successMessage = 'Información guardada en la base de datos.';

          this.generatePDF();
          this.generatePDF2();
          this.generatePDF3();
          // Ocultar el mensaje después de 5 segundos
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        (error) => {
          console.error('Error guardando el registro:', error);
        }
      );
    }
  }


  generatePDF() {
    this.http.get('assets/invoice-template.html', { responseType: 'text' })
      .pipe(map((template: string) => this.fillTemplate(template)))
      .subscribe(htmlContent => {
        // Crear un elemento temporal en el DOM
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-10000px';
        container.style.fontSize = '18px';
        container.style.lineHeight = '1.4';
        container.style.width = '210mm';
        container.style.height = '380mm';
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        const barcodeContainer = document.getElementById('barcodeContainer');
        if (barcodeContainer) {
          JsBarcode("#barcode", "(415)7777777777777(8020)777777777777(3900)7777777777(96)20240915", {
            format: "CODE128",
            width: 2,
            height: 300,
            displayValue: true,
            fontSize: 35
          });
        }

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
          const finalWidth = imgWidth * scaleFactor * 1.5;
          const finalHeight = imgHeight * scaleFactor * 1.5;

          pdf.addImage(imgData, 'PNG', marginX, marginY, Math.min(finalWidth, pageWidth), Math.min(finalHeight, pageHeight));

          const pdfBlob = pdf.output('blob');
          const blobUrl = URL.createObjectURL(pdfBlob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.target = '_blank';
          link.click();

          document.body.removeChild(container);
        });
      });
  }

  generatePDF2() {
    this.http.get('assets/invoice-template-2.html', { responseType: 'text' })
      .pipe(map((template: string) => this.fillTemplate(template)))
      .subscribe(htmlContent => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-10000px';
        container.style.fontSize = '18px';
        container.style.lineHeight = '1.4';
        container.style.width = '210mm';
        container.style.height = '380mm';
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        const barcodeContainer = document.getElementById('barcodeContainer');
        if (barcodeContainer) {
          JsBarcode("#barcode", "(415)7777777777777(8020)777777777777(3900)7777777777(96)20240915", {
            format: "CODE128",
            width: 2,
            height: 300,
            displayValue: true,
            fontSize: 35
          });
        }

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
          const finalWidth = imgWidth * scaleFactor * 1.5;
          const finalHeight = imgHeight * scaleFactor * 1.5;

          pdf.addImage(imgData, 'PNG', marginX, marginY, Math.min(finalWidth, pageWidth), Math.min(finalHeight, pageHeight));

          const pdfBlob = pdf.output('blob');
          const blobUrl = URL.createObjectURL(pdfBlob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.target = '_blank';
          link.click();

          document.body.removeChild(container);
        });
      });
  }

  generatePDF3() {
    this.http.get('assets/invoice-template-3.html', { responseType: 'text' })
      .pipe(map((template: string) => this.fillTemplate(template)))
      .subscribe(htmlContent => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-10000px';
        container.style.fontSize = '18px';
        container.style.lineHeight = '1.4';
        container.style.width = '210mm';
        container.style.height = '380mm';
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        const barcodeContainer = document.getElementById('barcodeContainer');
        if (barcodeContainer) {
          JsBarcode("#barcode", "(415)7777777777777(8020)777777777777(3900)7777777777(96)20240915", {
            format: "CODE128",
            width: 2,
            height: 300,
            displayValue: true,
            fontSize: 35
          });
        }

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
          const finalWidth = imgWidth * scaleFactor * 1.5;
          const finalHeight = imgHeight * scaleFactor * 1.5;

          pdf.addImage(imgData, 'PNG', marginX, marginY, Math.min(finalWidth, pageWidth), Math.min(finalHeight, pageHeight));

          const pdfBlob = pdf.output('blob');
          const blobUrl = URL.createObjectURL(pdfBlob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.target = '_blank';
          link.click();

          document.body.removeChild(container);
        });
      });
  }

  fillTemplate(template: string): string {
    let filledTemplate = template;
    filledTemplate = filledTemplate.replace('{{logo}}', this.logo);
    filledTemplate = filledTemplate.replace('{{empresa}}', this.usuario.empresa);
    filledTemplate = filledTemplate.replace('{{periodo}}', this.usuario.periodo);
    filledTemplate = filledTemplate.replace('{{invoiceNumber1}}', this.invoiceNumber1);
    filledTemplate = filledTemplate.replace('{{invoiceNumber2}}', this.invoiceNumber2);
    filledTemplate = filledTemplate.replace('{{invoiceNumber3}}', this.invoiceNumber3);
    filledTemplate = filledTemplate.replace('{{fechaEmision}}', this.fechaEmision.toLocaleDateString());
    filledTemplate = filledTemplate.replace('{{fechaVencimiento}}', this.fechaVencimiento.toLocaleDateString())
    filledTemplate = filledTemplate.replace('{{reporteEntradas}}', this.movilizacion.reporteEntradas.toLocaleString('es-CO'));
    filledTemplate = filledTemplate.replace('{{noNovedades}}', this.movilizacion.noNovedades.toLocaleString('es-CO'));
    filledTemplate = filledTemplate.replace('{{baseLiquidacion}}', this.movilizacion.baseLiquidacion.toLocaleString('es-CO'));
    filledTemplate = filledTemplate.replace('{{aportesFet}}', this.formatAsCurrency(this.liquidation.aportesFet));
    filledTemplate = filledTemplate.replace('{{aportesFQ}}', this.formatAsCurrency(this.liquidation.aportesFQ));
    filledTemplate = filledTemplate.replace('{{aportesAMB}}', this.formatAsCurrency(this.liquidation.aportesAMB));
    filledTemplate = filledTemplate.replace('{{totalAportesFet}}', this.formatAsCurrency(this.liquidation.aportesFet));
    filledTemplate = filledTemplate.replace('{{totalAportesFQ}}', this.formatAsCurrency(this.liquidation.aportesFQ));
    filledTemplate = filledTemplate.replace('{{totalAportesAMBQ}}', this.formatAsCurrency(this.liquidation.aportesAMB));

    return filledTemplate;
  }
}
