// Autor: Cecilia Martínez Ibáñez
// Ejercicio publicación
// Fecha:17/06/2019

// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBv2KSC6MUeTDEct7jIv0_vAVXHu1mbj0U",
  authDomain: "territorios-ce431.firebaseapp.com",
  databaseURL: "https://territorios-ce431.firebaseio.com",
  projectId: "territorios-ce431",
  storageBucket: "",
  messagingSenderId: "1071137868108",
  appId: "1:1071137868108:web:ebf471117c4a4c98"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Definción de eventos para botones de registro y conexión

var re = document.getElementById("registrar");
re.addEventListener("click", registrar, false);
var co = document.getElementById("conectar");
co.addEventListener("click", conectar, false);

function registrar() {
  var email = document.getElementById("email1").value;
  var password = document.getElementById("password1").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
      confirmar();
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
      $("#modalRegistro").modal('hide');
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function conectar() {
  var email = document.getElementById("email2").value;
  var password = document.getElementById("password2").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Existe usuario activo.");
      contenidosUsuarioRegistrado(user);

      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log("Usuario verificado:" + emailVerified);
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    } else {
      // User is signed out.
      console.log("No existe ningún usuario activo.");
      var contenido = document.getElementById("contenido");
      contenido.innerHTML = `
      <p>Conéctate para acceder a tu cuenta de registro de terrenos.</p>
      `;
    }
  });
}


function contenidosUsuarioRegistrado(usuario) {
  var contenido = document.getElementById("contenido");
  if (usuario.emailVerified) {
    contenido.innerHTML = `
    <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
      <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
      <p>Territorios / Usuarios.</p>
      <hr>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <h2>Gestión de datos</h2>
    <p>Todos los datos son obligatorios</p>
    <form action="#" class="form-inline">
      <div class="form-row">
      <div class="col-md-2 mb-3">
        <label for="tipo">Tipo:</label>
        <input  type="number" id="tipo" placeholder="Tipo de territorio" class="form-control" maxlenght="2" onchange="valtipo();" required>
      </div>
      <div class="col-md-2 mb-3">
        <label for="iden">Territorio:</label>
        <input type="text" id="iden" placeholder="Introduzce  territorio"class="form-control" maxlenght="3" onchange="validen();" required>
      </div>
      <div class="col-md-4 mb-3">
        <label for="fechaIni">Fecha Inicio:</label>
        <input type="date" id="fechaIni" class="form-control" maxlegth="10" placeholder="Introduzce fecha de inicio" onchange="valfechaIni();" required>
      </div>
      <div class="col-md-4 mb-3">
          <label for="fechaFin">Fecha Final:</label>
          <input type="date" id="fechaFin" class="form-control" placeholder="Introduzce fecha final" maxlegth="10" onchange="valfechaFin();" required>
      </div>
      </div>

      <div class="form-row">
      <div class="col-md-4 mb-3">
        <label for="cuando">Cuando:</label>
        <input type="text" id="cuando" class="form-control" placeholder="¿Cuándo?" maxlenght="50" onchange="valcuando();" required>
      </div>

      <div class="col-sm3">
        <label for="empleado">Nombre:</label>
        <input type="number" id="empleado" placeholder="¿Quién?" class="form-control" max="120" min="1" onchange="valempleado();" required>
      </div>
      </div>
      <button class="btn btn-info my-3" id="guardar">Guardar></button>
      <div id="act"></div>
      <div class="col-sm-3"></div>
    </form>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Tipo</th>
            <th scope="col">Terreno</th>
            <th scope="col">FechaInicio</th>
            <th scope="col">Fecha Finin</th>
            <th scope="col">Cuando</th>
            <th scope="col">Empleado</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody id="tabla">
        </tbody>
      </table>
    `;
    cargarTabla();
    $("#cerrarconexion").html(`<button id="cerrar" class="btn btn-info btn-sm ml-2">Cerrar sesión</button>`);
    var ce = document.getElementById("cerrar");
    ce.addEventListener("click", cerrar, false);
    var gu = document.getElementById("guardar");
    gu.addEventListener("click", guardar, false);

  } else {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Activa tu cuenta para ver nuestros contenidos para usuarios registrados.</p>
        <hr>
        <p class="mb-0">Revisa tu correo electrónico</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
  }
}

function cerrar() {
  firebase.auth().signOut()
    .then(function () {
      console.log("Saliendo...");
      $("#botones").css("visibility", "visible");
      $("#cerrarconexion").css("display", "none");
      contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-2" role="alert">
        <strong>¡Cáspitas!</strong> Esperamos verte pronto otra vez por nuestro portal.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
      cerrarconexion.innerHTML = "";
    })
    .catch(function (error) {
      console.log(error);
    });
}

function confirmar() {
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function () {
    // Email sent.
    console.log("Enviando correo...");
  }).catch(function (error) {
    // An error happened.
    console.log(error);
  });
}

function guardar() {
  var tipo = document.getElementById("tipo").value;
  var iden = document.getElementById("iden").value;
  var fechaIni = document.getElementById("fechaIni").value;
  var fechaFin = document.getElementById("fechaFin").value;
  var cuando = document.getElementById("cuando").value;
  var empleado = document.getElementById("empleado").value;
  if (tipo.trim() === "" || iden.trim() === "" || fechaIni.trim() === "" || fechaFin.trim() === "" || cuando.trim() === "" || empleado.trim() === "") {
    alert("Todos los datos son obligatorios.");
  } else {
    var usuario = {
      tipo: tipos,
      iden: idens,
      fechaIni: fechaInis,
      fechaFin: fechaFins,
      cuando: cuandos,
      empleado: empleados,
    };

    db.collection("usuarios").add(usuario)
      .then(function (docRef) {
        console.log("Documento escrito con ID: ", docRef.id);
        document.getElementById("tipo").value = "";
        document.getElementById("iden").value = "";
        document.getElementById("fechaIni").value = "";
        document.getElementById("fechaFin").value = "";
        document.getElementById("cuando").value = "";
        document.getElementById("empleado").value = "";
      })
      .catch(function (error) {
        console.error("Error añadiendo el documento: ", error);
      });
  }
}

// Lectura de los documentos
function cargarTabla() {
  db.collection("usuarios").onSnapshot((querySnapshot) => {
    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    querySnapshot.forEach((doc) => {
      tabla.innerHTML += `
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().tipo}</td>
          <td>${doc.data().iden}</td>
          <td>${doc.data().fechaIni}</td>
          <td>${doc.data().fechaFin}</td>
          <td>${doc.data().cuando}</td>
          <td>${doc.data().empleado}</td>
          <td><button class="linea btn btn-success" onclick="editar('${doc.id}', '${doc.data().tipo}', '${doc.data().iden}', '${doc.data().fechaIni}', '${doc.data().fechaFin}', '${doc.data().cuando}', '${doc.data().empleado}');">Editar</button></td>
          <td><button class="linea btn btn-danger" onclick="borrar('${doc.id}');">Eliminar</button></td>
        </tr>
        `;
    });
  });
}

// Borrar datos de documentos
function borrarDatos(parId) {
  var re = confirm("¿Está seguro que quiere borrar el campo " + parId + "?");
  if (re == true) {
    db.collection("usuarios").doc(parId).delete()
      .then(function () {
        console.log("Dato borrado correctamente.");
      }).catch(function (error) {
        console.error("Error: ", error);
      });
  }
}

//  Editar datos de documentos
function editarDatos(parId, parTipo, parIden, parfechaIni, parfechaFin, parCuando, parEmpleado) {
  document.getElementById("tipo").value = parTipo;
  document.getElementById("iden").value = parIden
  document.getElementById("fechaIni").value = parfechaIni;
  document.getElementById("fechaFin").value = parfechaFin;
  document.getElementById("cuando").value = parCuando;
  document.getElementById("empleado").value = parEmpleado;
  $("#guardar").css("display", "none");
  $(".linea").attr("disabled", true);
  $("#act").append("<button class='btn btn-info my-3' id='actualizar'>Guardar</button>");
  $("#actualizar").on("click", function () {
    var userRef = db.collection("usuarios").doc(parId);
    tipos = document.getElementById("tipo").value;
    idens = document.getElementById("iden").value;
    fechaInis = document.getElementById("fechaIni").value;
    fechaFins = document.getElementById("fechaFin").value;
    cuandos = document.getElementById("cuando").value;
    empleados == document.getElementById("empleado").value;

    if (tipos.trim() === "" || idens.trim() === "" || fechaInis.trim() === "" || fechaFins.trim() === "" || cuandos.trim() === "" || empleados.trim() === "") {
      alert("Todos los datos son obligatorios.");
      return false;
    } else {
      return userRef.update({
          tipo: document.getElementById("tipo").value,
          iden: document.getElementById("iden").value,
          fechaIni: document.getElementById("fechaIni").value,
          fechaFin: document.getElementById("fechaFin").value,
          cuando: document.getElementById("cuando").value,
          empleado: document.getElementById("empleado").value
        })
        .then(function () {
          console.log("Usuario actualizado correctamente.");
          document.getElementById("tipo").value = "";
          document.getElementById("iden").value = "";
          document.getElementById("fechaIni").value = "";
          document.getElementById("fechaFin").value = "";
          document.getElementById("cuando").value = "";
          document.getElementById("empleado").value = "";
          $("#guardar").css("display", "inline");
          $(".linea").attr("disabled", false);
          $("#act").empty();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error actualizando datos: ", error);
        });
    }
  })
}

function valtipo() {
  var patt = /^(?:[1-9]|0[1-9]|10)$/;
  var tipos = document.getElementById("tipo").value;
  if (!patt.test(tipos)) {
    alert("Dato incorrecto, introduzca un dato del 1 a 10.");
    return false;
  } else {
    return true
  }
}

function validen() {
  var patt = /^(?:[1-9]|0[1-9]|10)$"/;
  var idens = document.getElementById("iden").value;
  if (!patt.test(idens)) {
    alert("Dato incorrecto, introduzca un dato del 1 a 300.");
    return false;
  } else {
    return true
  }
}

function valfechaIni() {
  fechais = new Date(fechaIni.split("/").reverse().join("/"));
  if (fechais <= new Date(fechaIni.value)) {
    return true;
  } else {
    alert("Dato incorrecto, introduzca una fecha anterior a hoy.")
    document.getElementById("fechaIni");
    return false;
  }
}

function valfechaFin() {
  fechafs = new Date(fechaIni.split("/").reverse().join("/"));
  if (fechafs <= new Date(fechaFin.value)) {
    return true;
  } else {
    alert(fechaFins.value + "Dato incorrecto, introduzca una fecha posterior a la fecha inicial.");
    document.getElementById("fechaFin");
    return false;
  }
}

function valcuando() {
  var patt = /^[A-Za-zÑñÁÉÍÓúáéíóúÇç\s]{1,50}$"/;
  var cuandos = document.getElementById("cuando").value;
  if (!patt.test(cuando)) {
    alert(cuandos.value + "Dato incorrecto, introduzca máximo 50 caracteres.");
    return false;
  } else {
    return true;
  }
}

function valempleado() {
  var patt = /^(120|1[0-1][0-9]|[1-9]?[0-9])$/;
  var empleados = document.getElementById("empleado").value;
  if (patt.test(empleados)) {
    alert("Dato incorrecto, intruduzca un número entre 1 y 120")
    return false;
  } else {
    return true;
  }
}

observador();