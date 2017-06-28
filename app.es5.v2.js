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
    xhr.open('GET',urlSearchData + txt.value );
    console.info('Getting search result...');
    xhr.send();

    //getCategoryData Callback
    function xhrOK() {

        var items = JSON.parse(xhr.responseText);

        for(var i = 0; i < maxItems; i++){

            var xhrDet = new XMLHttpRequest();
            var urlDet = 'https://api.mercadolibre.com/items/' + items.results[i].id + '/description';

            xhrDet.addEventListener('load', callback(i));

            console.info('Getting description Data index:' + i);
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
          var resp  = JSON.parse(data.responseText);
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
Bien, logramos una version que cumple con los puntos 1,2 de lo pedido.
Pero seguimos sin controlar el orden de llegada de los pedidos asinc.
Para lograr esto en ES5 deberia utilizar una libreria externa como jQuery que maneje
promesas o implementar algún mecanismo de secuencia onda callback hell, poco mantenible. :(
*/
