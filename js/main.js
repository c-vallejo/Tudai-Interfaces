let canvas = document.getElementById("canvas");


canvas.addEventListener('mousedown', pulsaRaton, false);
canvas.addEventListener('mousemove', mueveRaton, false);
canvas.addEventListener('mouseup', levantaRaton, false);
let ctx2 = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let imageData2;
let r = 0;
let g = 0;
let b = 0;
let estoyDibujando = false;
let herramienta = "lapiz";


window.onload = function() {
    let input = document.getElementById('file-input');
    input.addEventListener('change', mostrarImagen);
}

function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top),
    };
}

function mostrarImagen(e) {

    let file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = readerEvent => {
        let content = readerEvent.target.result;

        let image1 = new Image;

        image1.src = content;

        image1.onload = function() {

            let imageAspectRatio = (1.0 * this.height) / this.width;
            let imageScaleWidth = width;
            let imageScaleHeight = width * imageAspectRatio;

            ctx2.drawImage(this, 0, 0, imageScaleWidth, imageScaleHeight);
            imageData2 = ctx2.getImageData(0, 0, imageScaleWidth, imageScaleHeight);

        }
    }
}

function getContexData() {
    imageData2 = ctx2.getImageData(0, 0, width, height);
}


function getRojo(x, y) {
    index = (x + y * imageData2.width) * 4;
    return imageData2.data[index];
}

function getVerde(x, y) {
    index = (x + y * imageData2.width) * 4;
    return imageData2.data[index + 1];
}

function getAzul(x, y) {
    index = (x + y * imageData2.width) * 4;
    return imageData2.data[index + 2];
}

function getPixel(x, y) {
    r = getRojo(x, y);
    g = getVerde(x, y);
    b = getAzul(x, y);
}

function setPixel(x, y, r, g, b, a) {
    index = (x + y * imageData2.width) * 4;
    imageData2.data[index + 0] = r;
    imageData2.data[index + 1] = g;
    imageData2.data[index + 2] = b;
    imageData2.data[index + 3] = a;
}

function blancoYNegro() {
    getContexData();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            getPixel(x, y);
            let Color = Math.round((r + g + b) / 3);
            setPixel(x, y, Color, Color, Color, 255);
        }
    }
    ctx2.putImageData(imageData2, 0, 0);
}


function sepia() {
    getContexData();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            getPixel(x, y);
            let r1 = Math.round((0.393 * r) + (0.769 * g) + (0.189 * b));
            let g1 = Math.round((0.349 * r) + (0.686 * g) + (0.168 * b));
            let b1 = Math.round((0.272 * r) + (0.534 * g) + (0.131 * b));
            setPixel(x, y, r1, g1, b1, 255);
        }
    }
    ctx2.putImageData(imageData2, 0, 0);
}

function invertir() {
    getContexData();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            getPixel(x, y);
            setPixel(x, y, 255 - r, 255 - g, 255 - b, 255);
        }
    }
    ctx2.putImageData(imageData2, 0, 0);
}

function binarizacion() {
    getContexData();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            getPixel(x, y);
            let Color = Math.round((r + g + b) / 3);
            if (Color < 127) {
                setPixel(x, y, 0, 0, 0, 255);
            } else {
                setPixel(x, y, 255, 255, 255, 255);
            }
        }
    }
    ctx2.putImageData(imageData2, 0, 0);
}


function cambioelsig(x, y) {
    if (y < height) {
        getPixel(x, y);
        let color = Math.round((r + g + b) / 3);
        let colorsig = Math.round((getRojo(x, y + 1) + getVerde(x, y + 1) + getAzul(x, y + 1)) / 3);
        if ((color - colorsig) < 10) {
            return false;
        } else {
            return true;
        }
    }
}

function cambioelsigx(x, y) {
    if (x < width) {
        getPixel(x, y);
        let color = Math.round((r + g + b) / 3);
        let colorsig = Math.round((getRojo(x + 1, y + 1) + getVerde(x + 1, y) + getAzul(x + 1, y)) / 3);
        if ((color - colorsig) < 10) {
            return false;
        } else {
            return true;
        }
    }
}

function deteccionDeBordes() {
    getContexData();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (cambioelsig(x, y)) {
                setPixel(x, y, 255, 255, 255, 255);
            } else {
                setPixel(x, y, 0, 0, 0, 255);
            }
            if (cambioelsigx(x, y)) {
                setPixel(x, y, 255, 255, 255, 255);
            } else {
                setPixel(x, y, 0, 0, 0, 255);
            }
        }
    }
    ctx2.putImageData(imageData2, 0, 0);
}

function saturar() {
    getContexData();
    let level = 10;
    let cantidad = document.getElementById('valor').value;
    if (cantidad != 0) { level = cantidad };
    for (let x = 1; x < width; x++) { //ancho
        for (let y = 1; y < height; y++) { //alto
            getPixel(x, y);
            r1 = ((((r / 255) - 0.5) * level) + 0.5) * 255;
            g1 = ((((g / 255) - 0.5) * level) + 0.5) * 255;
            b1 = ((((b / 255) - 0.5) * level) + 0.5) * 255;
            setPixel(x, y, r1, g1, b1, 255);

        }
    }
    document.getElementById("demo").innerHTML = cantidad;
    ctx2.putImageData(imageData2, 0, 0);
}

function blur() {
    getContexData();
    for (let x = 1; x < width; x++) { //ancho
        for (let y = 1; y < height; y++) { //alto
            if ((x + 1 < width) && (x - 1 >= 0) && (y + 1 < height) && (y - 1 >= 0)) {
                let Rojo = (getRojo(x - 1, y - 1) + getRojo(x - 1, y - 1) + getRojo(x + 1, y - 1) + getRojo(x - 1, y) + getRojo(x, y) + getRojo(x + 1, y) + getRojo(x - 1, y + 1) + getRojo(x, y + 1) + getRojo(x + 1, y + 1)) / 9;
                let Verde = (getVerde(x - 1, y - 1) + getVerde(x - 1, y - 1) + getVerde(x + 1, y - 1) + getVerde(x - 1, y) + getVerde(x, y) + getVerde(x + 1, y) + getVerde(x - 1, y + 1) + getVerde(x, y + 1) + getVerde(x + 1, y + 1)) / 9;
                let Azul = (getAzul(x - 1, y - 1) + getAzul(x - 1, y - 1) + getAzul(x + 1, y - 1) + getAzul(x - 1, y) + getAzul(x, y) + getAzul(x + 1, y) + getAzul(x - 1, y + 1) + getAzul(x, y + 1) + getAzul(x + 1, y + 1)) / 9;
                setPixel(x, y, Rojo, Verde, Azul, 255);
            }
        }
    }

    ctx2.putImageData(imageData2, 0, 0);
}

function mostrarvalor() {
    document.getElementById("demo").innerHTML = saturBtm.value;
}

function guardarImagen() {
    let link = window.document.createElement('a');
    let url = canvas.toDataURL();
    let filename = 'image.png';
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
}

function mueveRaton(event) {
    if (estoyDibujando) {
        let pos = getMousePos(canvas, event);
        if (herramienta == "goma") {
            ctx2.strokeStyle = '#FFFFFF';
            ctx2.lineWidth = 30;
        }
        if (herramienta == "lapiz") {
            ctx2.strokeStyle = '#000000'
            ctx2.lineWidth = 1;
        }
        ctx2.lineTo(pos.x, pos.y);
        ctx2.stroke();
    }

}

function levantaRaton() {
    if (estoyDibujando = true) {
        ctx2.closePath();
        estoyDibujando = false;
    }

}

function pulsaRaton(event) {
    let pos = getMousePos(canvas, event);
    estoyDibujando = true;
    ctx2.beginPath();
    ctx2.moveTo(pos.x, pos.y);

}

function escribir() {
    herramienta = "lapiz";

}

function borrar() {
    herramienta = "goma";

}

function nuevolienzo() {
    //clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas.width, canvas.height);


}
let bynBtm = document.getElementById('blancoynegro');
bynBtm.addEventListener('click', blancoYNegro);
let sepiaBtm = document.getElementById('sepia');
sepiaBtm.addEventListener('click', sepia);
let invBtm = document.getElementById('invertido');
invBtm.addEventListener('click', invertir);
let binBtm = document.getElementById('binario');
binBtm.addEventListener('click', binarizacion);
let bordesBtm = document.getElementById('deteccionbordes');
bordesBtm.addEventListener('click', deteccionDeBordes);
let satBtm = document.getElementById('saturacion');
satBtm.addEventListener('click', saturar);
let blurBtm = document.getElementById('blur');
blurBtm.addEventListener('click', blur);
let saturBtm = document.getElementById('valor');
saturBtm.addEventListener('change', mostrarvalor);
let bajarBtm = document.getElementById('dowload');
bajarBtm.addEventListener('click', guardarImagen);
let lapizBtm = document.getElementById('lapiz');
lapizBtm.addEventListener('click', escribir);
let borrarBtm = document.getElementById('goma');
borrarBtm.addEventListener('click', borrar);
let newBtm = document.getElementById('nuevo');
newBtm.addEventListener('click', nuevolienzo);