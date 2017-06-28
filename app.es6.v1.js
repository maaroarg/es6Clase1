/*
    1) Realizar un llamado a la api de busquedas de MELI, traer los primeros X items.
    2) Llamar a la api de detalle (description) y traer el snapshot de cada una de las X publicaciones.
    3) Mostrar en pantalla los resultados en el mismo orden en que se pidieron
*/

/************* VERSION ES6 ***************/

//document.addEventListener('DOMContentLoaded',getSearchData);
let contenedor = document.querySelector('#contenedor');
let btn = document.querySelector('button');
let txt = document.querySelector('#txt');
btn.addEventListener('click',getSearchData);
const urlSearchData = `https://api.mercadolibre.com/sites/MLA/search?q=`; //MELI ENDPOINT
const maxItems = 5;

function getSearchData() {

    contenedor.innerHTML = "";
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load',xhrOK);
    xhr.open('GET',`${urlSearchData}${txt.value}`);
    console.info('Getting Categories...');
    xhr.send();

    //getCategoryData Callback
     function xhrOK() {

        let items = JSON.parse(xhr.responseText);

        for(let i = 0; i < maxItems; i++){

            var xhrDet = new XMLHttpRequest();
            var urlDet = `https://api.mercadolibre.com/items/${items.results[i].id}/description`;
            xhrDet.addEventListener('load', callback(i));

            console.info(`Getting description index: ${i}`);
            xhrDet.open('GET',urlDet);
            xhrDet.send();

        }

        //Wrapper de xhrDet que me genera un contexto para usar la var "i"
        function callback(i){
          return function(){
            xhrDetOK(this,i);
          }
        }

        //categories data Callback
        function xhrDetOK(data,i){
          let resp  = JSON.parse(data.responseText);
          console.log(`Snapshot Data index: ${i} url: ${resp.snapshot.url}`);
          createImage(resp.snapshot.url);
        }
    }

    //Funcion que genera la imagen en el DOM
      var createImage = (url) => {
        //Genero un elemento img y lo agrego al DOM
        var contenedor = document.querySelector('#contenedor');
        var nuevaImagen = document.createElement('img');
        nuevaImagen.src = url;
        nuevaImagen.style.width = "10%";
        contenedor.appendChild(nuevaImagen);
      }
}


/*
1) Las variables las defino con let para generar un contexto de bloque
2) Los textos los paso a template strings para evitar concatenar
3) En la funcion "callback" no necesitamos generar el closure para capturar el valor de i,
con definir a la variable con let alcanza
4) Las funciones que no utilizan "this" las puedo reemplazar por arrow functions
*/
