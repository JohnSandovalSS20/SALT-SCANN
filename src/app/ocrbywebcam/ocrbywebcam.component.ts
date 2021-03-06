import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { OcrService } from '../ocr.service';
import * as Tesseract from 'tesseract.js';
//import domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-ocrbywebcam',
  templateUrl: './ocrbywebcam.component.html',
  styleUrls: ['./ocrbywebcam.component.scss']
})
export class OcrbywebcamComponent implements OnInit {
  image: string = null;
  text: string;
  status: string;
  confidence;

  public showWebcam = true;
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();

  constructor() { }

  ngOnInit() {
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.log('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.recognize(webcamImage.imageAsDataUrl);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  recognize(img: string) {
    Tesseract.recognize(img)
      .progress((progress) => {
        this.confidence = progress.progress;
        this.status = progress.status;
      })
      .catch(err => console.log(err))
      .then((value) => {
        this.text = value.text;
        this.confidence = value.confidence;
      })
      .finally(resultOrError => console.log(resultOrError));
  }
  validarImagen() {
    if (this.image == null) {

      var btnAbrirPopup = document.getElementById('btn-abrir-popup'),
        overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup'),
        btnCerrarPopup = document.getElementById('btn-cerrar-popup');

      btnAbrirPopup.addEventListener('click', function () {
        overlay.classList.add('active');
        popup.classList.add('active');

      });

      btnCerrarPopup.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.classList.remove('active');
        popup.classList.remove('active');
        document.location.reload();

      });
      
        this.desactivaBotones();
    }
    else if(this.image!=null)
    {
      this.onUpload();
    }
  }

  onUpload() {

    this.recognize(this.image);
  }


  crearPdf() {
    var ta2 = prompt("Ingresa un nombre para el archivo","");
    alert("Tu archivo se guardo con el nombre: "+ta2)
    var doc = new jsPDF('p', 'pt', 'landscape');
    var ta = document.getElementById('texto');
    
    var elementHTML = $('#texto').html();
    var f = new Date();
    var n = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
    doc.setFontSize(10);
    doc.text('Archivo generado el ' + n,100,50,'center');
    var specialElementHandlers = {
      '#textoarea': function (element, renderer) {
        return true;
      }
    };
    doc.fromHTML(ta, 100, 150, {
      'width': 400,
      'elementHandlers': specialElementHandlers
    });
     doc.save(ta2 + ' ' + n + ' ' + '.pdf');
     document.location.reload();
  }  
  Export2Doc(element, filename = '') {

    var valorTexto = document.getElementById(element).innerHTML;
    var nombredoc= prompt("Introduce un nombre para el documento en Word: ");
    alert("Tu archivo se guardo con el nombre: "+nombredoc)
    var f = new Date();
    var n = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
    var btnBlock = document.getElementById('dwlddoc');
    if (valorTexto == null) {
      btnBlock.setAttribute('disabled', 'disabled');
    }
    else {
      var html = document.getElementById(element).innerHTML;
      var blob = new Blob([''], {
        type: 'application/word'
      });

      //     // Especificamos la URL y el meta Charset con utf-8 para que sea legible
      var url = 'data:application/vnd.word;charset=utf-8,' + encodeURIComponent(html);

      //     // Le damos un nombre al archivo con su extension
      filename = nombredoc ? `${nombredoc+' '+n}.doc` : nombredoc+''+n+'.docx';

      //     // Creamos un link (abstracto) para descargar el archivo 
      var downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        //       // Creamos un link para el archivo
        downloadLink.href = url;

        //       // Configuramos el nombre ya seteado
        downloadLink.download = filename;

        //Mandamos a llamar la funcion del Link con una funcion
        downloadLink.click();
      }

    }

    document.body.removeChild(downloadLink);
    document.location.reload();
  }
  ExportTxt(element, filename = '') {
    var html = document.getElementById(element).innerHTML;
    var nombretxt= prompt("Introduce un nombre para el documento en Txt: ");
    alert("Tu archivo se guardo con el nombre: "+nombretxt);
    var f = new Date();
    var n = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
    var blob = new Blob([''], {
      type: 'txt'
    });

    //   // Especificamos la URL y el meta Charset con utf-8 para que sea legible
    var url = 'data:application/vnd.word;charset=utf-8,' + encodeURIComponent(html);

    //   // Le damos un nombre al archivo con su extension
    filename = nombretxt ? `${nombretxt+' '+n}.txt` : nombretxt+'.txt';

    // Creamos un link (abstracto) para descargar el archivo 
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Creamos un link para el archivo
      downloadLink.href = url;

      //     // Configuramos el nombre ya seteado
      downloadLink.download = filename;

      //     Mandamos a llamar la funcion del Link con una funcion
      downloadLink.click();
    }

    document.body.removeChild(downloadLink);
    document.location.reload();
  }
  desactivaBotones() {
    var dsbltexto = document.getElementById('texto');
    dsbltexto.setAttribute('disabled', 'true');
    var dsblPdf = document.getElementById('dwnPdf');
    dsblPdf.setAttribute('disabled', 'true');
    var dsblWord = document.getElementById('dwlddoc');
    dsblWord.setAttribute('disabled', 'true');
    var dsblTxt = document.getElementById('dwnTxt');
    dsblTxt.setAttribute('disabled', 'true');
   
  }



}
