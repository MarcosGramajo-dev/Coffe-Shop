// const e = require("express");

const form = document.getElementById("crearArticulo");
const carrito = document.getElementById("tbody");
const carrito2 = document.getElementById("tbody2");

let arrayCarrito = [];

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

addEventListener("DOMContentLoaded", actualizarLista);
window.onload = reducirStock;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = form.titulo.value;
  const descripcion = form.descripcion.value;

  const tipoDescuento = form.elements["tipoDescuento"].value;

  const cantStock = form.cantStock.value;
  const precioUnitario = form.precio.value;
  const foto = document.getElementById("foto").files[0];

  const Articulo = {
    titulo,
    descripcion,
    tipoDescuento,
    cantStock,
    precioUnitario,
  };

  const formData = new FormData();

  for (const key in Articulo) {
    if (Object.hasOwnProperty.call(Articulo, key)) {
      const element = Articulo[key];
      formData.append(key, element);
    }
  }
  
  formData.append("foto", foto);
  const response = await fetch(`api`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  actualizarLista();
});

function actualizarLista() {
  fetch(`api`)
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("contenedorArticulo");
      let arrayArticulos = [];
      container.innerHTML = "";

      for (const item of data) {
        arrayArticulos = [...arrayArticulos, item];
      }

      for (const articulo in arrayArticulos) {
        if (Object.hasOwnProperty.call(arrayArticulos, articulo)) {
          const item = arrayArticulos[articulo];
          container.innerHTML += `
                <div class="tarjeta" id="${item._id}">
                    <div class="foto">
                        <img src="${item.foto}" alt="#">
                        ${
                          item.tipoDescuento != "0"
                            ? `<div class="estrella"><p>${item.tipoDescuento}</p></div>`
                            : `<p>-</p>`
                        }
                    </div>
                    <p class="titulo">${item.titulo}</p>
                    <p class="descripcion">${item.descripcion}</p>
                    <p class="cantDisponible">Disponibles: ${item.cantStock}</p>
                    <div>
                    <button onclick="agregarCarrito(event)">Añadir al Carrito</button>
                    <p class="precio">$${item.precioUnitario}</p>
                    </div>
                </div>
                `;
        }
      }
    })
    .catch((error) => console.log(error));
}

async function eliminarArticulo(e) {
  console.log(e);
  const tarjetaID = e.id;

  await fetch(`api/${tarjetaID}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((error) => console.log(error));

  actualizarLista();
}

function agregarCarrito(e) {
  const tarjeta = e.target.parentElement.parentElement;

  let precioNum = parseInt(
    tarjeta.querySelector(".precio").textContent.slice(1, 10),
    10
  );

  const tarjetaCarrito = {
    img: tarjeta.querySelector("img").src,
    titulo: tarjeta.querySelector(".titulo").textContent,
    cantCompra: 1,
    precio: precioNum,
    descuento: tarjeta.querySelector(".foto p").textContent,
    id: tarjeta.id,
  };

  const articuloRepetido = arrayCarrito.some(
    (element) => element.id === tarjetaCarrito.id
  );

  if (articuloRepetido) {
    const sacarRepetido = arrayCarrito.map((element) => {
      if (element.id === tarjetaCarrito.id) {
        element.cantCompra++;
        if (element.descuento === "-10%") {
          let precioDescuento = precioNum * 0.9;
          element.precio += precioDescuento;
          return element;
        } else if (
          element.descuento === "2x1" &&
          element.cantCompra % 2 === 0
        ) {
          return element;
        } else if (
          element.descuento === "3x2" &&
          element.cantCompra % 3 === 0
        ) {
          return element;
        } else {
          element.precio += precioNum;
          return element;
        }
      } else {
        return element;
      }
    });

    arrayCarrito = [...sacarRepetido];
  } else {
    arrayCarrito = [...arrayCarrito, tarjetaCarrito];
  }

  limpiarCarrito();
}

function eliminarItemCarrito(e) {
  const eliminarID = e.target.parentElement.parentElement.id;

  const eliminarItemArray = arrayCarrito.filter(
    (element) => element.id != eliminarID
  );

  arrayCarrito = [...eliminarItemArray];
  limpiarCarrito();
}

function limpiarCarrito() {
  carrito.innerHTML = "";
  carrito2.innerHTML = "";

  arrayCarrito.forEach((element) => {
    carrito.innerHTML += `
        <tr id="${element.id}">
            <td><img src="${element.img}" alt="cafe"></td>
            <td>${element.titulo}</td>
            <td>${element.cantCompra}</td>
            <!-- <td>${element.descuento}</td> -->
            <td>${element.precio}</td>
            <td><button onclick="eliminarItemCarrito(event)" >X</button></td>
        </tr>
        `;
  });

  arrayCarrito.forEach((element) => {
    carrito2.innerHTML += `
        <tr id="${element.id}">
            <td><img src="${element.img}" alt="cafe"></td>
            <td>${element.titulo}</td>
            <td>${element.cantCompra}</td>
            <td>${element.descuento}</td>
            <td>${element.precio}</td>
            <td><button onclick="eliminarItemCarrito(event)" >X</button></td>
        </tr>
        `;
  });

}

async function realizarCompra() {
  let stockToF = true;
  await fetch(`api`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      for (const item in arrayCarrito) {
        const array = arrayCarrito[item];

        data.forEach((producto) => {
          if (producto._id === array.id) {
            console.log(array);
            if (producto.cantStock - array.cantCompra >= 0) {
            } else {
              return (stockToF = false);
            }
          }
        });
      }
      if (stockToF) {
        metodoDePago(arrayCarrito);
      } else {
        alert("No podemos seguir con la operacion");
      }

      //   carrito.innerHTML = "";
      //   arrayCarrito = [];
    })
    .catch((error) => console.log(error));
}

async function metodoDePago(arrayData) {
  console.log(arrayData);
  const arrayMP = arrayData.map((producto) => {
    return {
      id: producto.id,
      title: producto.titulo,
      currency_id: "ARS",
      picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
      description: producto.descripcion,
      category_id: "art",
      quantity: 1,
      unit_price: producto.precio,
    };
  });

  console.log(JSON.stringify({ arrayMP }));
  await fetch("http://localhost:8080/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ arrayMP }),
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("cart", JSON.stringify(arrayCarrito));
      window.location.href = data.init_point;
    })
    .catch((error) => console.log(error));
}

function reducirStock() {
  console.log(params);
  if (!params.status) {
    return;
  } else if (params.status === "approved") {
    arrayCarrito = JSON.parse(localStorage.getItem("cart"));
    fetch(`api`)
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        console.log(">>>>", arrayCarrito);

        for (let item of arrayCarrito) {
          let resultado;

          data.forEach((producto) => {
            console.log(producto._id, item);
            if (producto._id === item.id) {
              console.log("entro", producto._id);
              if (producto.cantStock - item.cantCompra >= 0) {
                resultado = producto.cantStock - item.cantCompra;
                console.log("fetch");
                fetch(`api/${item.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ cantStock: resultado }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((error) => {
                    console.log(error);
                  })
                  .finally(() => {
                    localStorage.removeItem("cart")
                    actualizarLista();
                });
                  
              } else if (resultado === 0) {
                eliminarArticulo(producto.id);
              }
            }

            //actualizarLista();
          });
        }
      })
      .catch((error) => console.log(error));
  } else if (params.status === "rejected") {
  }
}

/*
            for (const item in data) {
                    const elemento = data[item];
                    if(elemento._id === element.id){

                        if(elemento.cantStock - element.cantCompra >= 0){

                            let resultado = elemento.cantStock - element.cantCompra

                            fetch(url, {
                                method: 'PUT',
                                headers: {
                                    "Content-Type" : "application/json",
                                },
                                body: JSON.stringify({ cantStock: resultado })
                            })
                            .then(res => console.log(res))
                            .catch(error => console.log(error))

                            if(resultado){
                                eliminarArticulo(element);
                            }

                            actualizarLista()

                        } else{
                            console.log("No hay stock sufiente para la compra de", element.titulo)
                        }
                        return
                }
            }
*/
