const addItem = document.getElementById('addItem');
const shoppingCart = document.getElementById('carrito');
const modal = document.getElementById('modalConfirmarCompra');

console.log(arrayCarrito)

let toggleAddItem = true;
let toggleCarrito = true;
let toggleModal = false;

function expandModal(e){
    if(e === 'addIteam' && toggleAddItem === true){
        shoppingCart.style.display = 'none';
        toggleCarrito = true;

        addItem.style.display = 'block';
        toggleAddItem = false;
    }
    else if(e === 'addIteam' && toggleAddItem === false){
        addItem.style.display = 'none';
        toggleAddItem = true;
    }

    if(e === 'carrito' && toggleCarrito === true){
        addItem.style.display = 'none';
        toggleAddItem = true;

        shoppingCart.style.display = 'block';
        toggleCarrito = false;
    }
    else if(e === 'carrito' && toggleCarrito === false){
        shoppingCart.style.display = 'none';
        toggleCarrito = true;
    }
}

function openModal(){

    if(arrayCarrito != ""){
        if(toggleModal === false){
            toggleModal = true;
            modal.style.display = 'flex';
        }
        else if(toggleModal === true){
            toggleModal = false;
            modal.style.display = 'none';
        }
    } else{
        alert("El carrito esta vacio")
    }
}