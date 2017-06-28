/*
    1) Realizar una llamado a la api de busquedas de MELI, traer los primeros X items.
    2) Llamar a la api de detalle (description) y traer el snapshot de cada una de las X publicaciones.
    3) Mostrar en pantalla los resultados en el mismo orden en que se pidieron
*/

/************* VERSION ES6 ***************/

//Control de flujo principal con promesas. Encadeno las tareas utilizando ".then"
let go = () => {
  contenedor.innerHTML = "";
  makeRequest('GET',`${urlSearchData}${txt.value}`)
  .then(getDetData);
};

let contenedor = document.querySelector('#contenedor');
let btn = document.querySelector('button');
let txt = document.querySelector('#txt');
btn.addEventListener('click',go);
const urlSearchData = `https://api.mercadolibre.com/sites/MLA/search?q=`; //MELI ENDPOINT
const maxItems = 5;

//Funcion XHR generica que retorna una promesa
function makeRequest(method,url){
  return new Promise(function (resolve, reject){
    let xhr = new XMLHttpRequest();
    xhr.open(method,url);
    xhr.addEventListener('load',xhrOK);
    xhr.send();

    function xhrOK(e){
        if(e.target.status === 200){
          resolve(e.target.responseText);
        }
        else{
          reject({
            status:e.target.status,
            statusText:e.target.statusText
          });
        }
    }

  });
};

function getDetData(data){

  var items = JSON.parse(data);

  (function loop(i) {
      var urlDet = `https://api.mercadolibre.com/items/${items.results[i].id}/description`;
      console.info(`Getting description index: ${i}`);

      //Segundo control de flujo con promesas.
      makeRequest('GET',urlDet)
      .then( (data) => {
        let resp  = JSON.parse(data);
        console.log(`Snapshot Data index: ${i} url: ${resp.snapshot.url}`);
        createImage(resp.snapshot.url);
      })
      //Para no utilizar un ciclo for, uso recursividad.
      //Utilizando funciones generadoras puedo hacer lo mismo pero mas legible
      //y utilizando asinc/await (ES7) lo hago MUCHO mas legible.
      //To be continue...
      .then( () => i >= maxItems - 1  || loop(i+1) );
  })(0);

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
3) En la funcion "callback" no necesitamos generar el closure para capturar el valor de i
4) Las funciones que no utilizan "this" las puedo reemplazar por arrow functions
5) Mediante Promesas magia, logro el efecto sinc
*/
