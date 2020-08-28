let matcolum = 100;
let matfila = 100;
let rango = 100;

let matriz = [];

for (let i = 0; i < matfila; i++) {
    matriz[i] = [];
    for (let j = 0; j < matcolum; j++) {
        matriz[i][j] = Math.floor(Math.random() * rango);
    }
};

console.log("matriz:");
console.table(matriz);

function valorMax(matriz) {
    let maximo = Number.NEGATIVE_INFINITY;
    let columna = Number.NEGATIVE_INFINITY;
    let fila = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < matfila; i++) {
        for (let j = 0; j < matcolum; j++) {
            if (maximo < matriz[i][j]) {
                maximo = matriz[i][j];
                columna = j;
                fila = i;
            }
        }
    }

    console.log("el valor maximo es: " + maximo + " en la columna" + columna + " en la fila" + fila);
};

valorMax(matriz);