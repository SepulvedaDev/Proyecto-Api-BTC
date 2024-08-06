const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado')

const objBusqueda = {
    moneda: '',
    criptomoneda:  ''
}
// Crear un promise

const obtenerCriptomonedas = criptomonedas => new Promise (resolve =>{
    resolve(criptomonedas)
});

document.addEventListener('DOMContentLoaded', () =>{
    
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas (){

    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
    .then(res => res.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas (criptomonedas){
    criptomonedas.forEach(crip => {
        const {FullName,Name} = crip.CoinInfo
        const option = document.createElement('option')
        option.textContent = FullName;
        option.value = Name;
        criptomonedasSelect.appendChild(option)
    });
}

function leerValor (e){
    objBusqueda[e.target.name] = e.target.value 
    
    console.log(objBusqueda)
}

function submitFormulario  (e){
    e.preventDefault();

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados

    consultarAPI()
}

function mostrarAlerta (mensaje){
    const waos = document.querySelector('.error')
    if(!waos){
        const alerta = document.createElement('div');
        alerta.classList.add('error');
        alerta.textContent = mensaje;
        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

function consultarAPI (){
    const {moneda, criptomoneda} = objBusqueda;
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    
    mostrarSpinner();
    fetch(url)
    .then(res => res.json())
    .then(resultado => {

        MostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])
    })

}

function MostrarCotizacionHTML (cotizacion){
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;
    limpiarHTML()
    const precio = document.createElement('p')
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio Maximo: <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio Minimo: <span>${LOWDAY}</span>`

    const cambioDia = document.createElement('p');
    cambioDia.innerHTML = `Ultimas 24h: <span>${CHANGEPCT24HOUR}</span>`
    
    const UltimaACT = document.createElement('p');
    UltimaACT.innerHTML = `Ultima Actualizacion: <span>${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(cambioDia)
    resultado.appendChild(UltimaACT)
}
function limpiarHTML (){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML()

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = ` 
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
    `
    resultado.appendChild(spinner);
}