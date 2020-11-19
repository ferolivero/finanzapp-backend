
const CategoriasDefectoGasto = ["Comida","Vivienda","Servicios","Ocio","Otros"];
const CategoriasDefectoIngreso = ["Sueldo","Venta","Servicio","Renta","Otros"];
console.log(CategoriasDefectoGasto.length);
console.log('Creo las Categorias para el usuario')
//Creo las categorias de gastos
var email = "asd@gmail.com";


CategoriasDefectoGasto.forEach(cargarCategoriasGastoUsuario);
CategoriasDefectoIngreso.forEach(cargarCategoriasIngresoUsuario);

function cargarCategoriasGastoUsuario(item, index ) {
    let userCategoria = {
        tipo: "gasto",
        nombre: item,
        user: email
      };
    console.log("Se carga al usuario "+userCategoria.user);
    console.log(userCategoria);
    //await categoria.pushCategoriaUserNew(userCategoria);
}

function cargarCategoriasIngresoUsuario(item, index ) {
    let userCategoria = {
        tipo: "ingreso",
        nombre: item,
        user: email
      };
    console.log("Se carga al usuario "+userCategoria.user);
    console.log(userCategoria);
    //await categoria.pushCategoriaUserNew(userCategoria);
}
/*
CategoriasDefectoGasto.forEach(element => 
    userCategoria = {
    tipo: "gasto",
    nombre: element,
    user: email
  },
  console.log(userCategoria)
  
 // await categoria.pushCategoriaUserNew(userCategoria)
);
  
  CategoriasDefectoIngreso.forEach(element => 
    
    userCategoria = {
      tipo: "ingreso",
      nombre: element,
      user: email
    },
    console.log(userCategoria),
    userCategoria = {}
   // await categoria.pushCategoriaUserNew(userCategoria)
  );
*/