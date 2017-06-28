/*
    1) Realizar un llamado a la api de busquedas de MELI, traer los primeros X items.
    2) Llamar a la api de detalle (description) y traer el snapshot de cada una de las X publicaciones.
    3) Mostrar en pantalla los resultados en el mismo orden en que se pidieron
*/

/************* VERSION ES5 ***************/

//document.addEventListener('DOMContentLoaded',getSearchData);
var contenedor = document.querySelector('#contenedor');
var btn = document.querySelector('button');
var txt = document.querySelector('#txt');
btn.addEventListener('click',getSearchData);
var urlSearchData = 'https://api.mercadolibre.com/sites/MLA/search?q='; //MELI ENDPOINT
var maxItems = 5;

function getSearchData() {

    contenedor.innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load',xhrOK);
    xhr.open('GET', urlSearchData + txt.value );
    console.info('Getting search result...');
    xhr.send();

    //getCategoryData Callback
    function xhrOK() {

        var items = JSON.parse(xhr.responseText);

        for(var i = 0; i < maxItems; i++){

            var xhrDet = new XMLHttpRequest();
            var urlDet = 'https://api.mercadolibre.com/items/' + items.results[i].id + '/description';

            xhrDet.addEventListener('load', xhrDetOK);

            console.info('Getting description Data index:' + i);
            xhrDet.open('GET',urlDet);
            xhrDet.send();
        }

        //categories data Callback
        function xhrDetOK(data){
          var resp  = JSON.parse(data.target.responseText);
          console.log('Snapshot Data index:' + i , resp.snapshot.url );
          createImage(resp.snapshot.url);
        }
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

/*
Para poder utilizar la variable index, debo generar un callback que acepte de parametro la variable "i"
y que retorne una funcion para hacer de callback "real".
De esta forma le genero un contexto donde esta variable tiene un valor constante.

Esto me permite verificar que sigo con el problema del orden de los callbacks.
Cada respuesta se atiende "ondemand"
*/
