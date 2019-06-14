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
var co = document.getElementById("conectar");
co.addEventListener("click", conectar, false);

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

      console.log('Usuario verificado: ' + emailVerified);
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    } else {
      // User is signed out.
      console.log("No existe ningún usuario activo.");
      var contenido = document.getElementById("contenido");
      contenido.innerHTML = `
      <p>Conéctate para ver los contenidos exclusivos para usuarios registrados.</p>
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

        <hr>
        <p class="mb-0">Tenemos muchos contenidos exclusivos solo para usuarios registrados como tú.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form action="#">
      <nav class="navbar bg-warning navbar-dark">
        <a class="navbar-brand">Territorios</a>
        <div id="botones" class="form-inline">
          <input id="email2" type="email" placeholder="Introduce tu e-mail"
            class="form-control form-control-sm mr-sm-2">
          <input id="password2" type="password" placeholder="Introduce tu constraseña"
            class="form-control form-control-sm mr-sm-2">
          <button id="conectar" class="btn btn-dark my-2 my-sm-0 btn-sm">Conectar</button>
        </div>
        <div id="territorios" class="form-inline">
          <div class="form-inline">
            <label for="tipo" class="col-sm-2 col-form-label"></label>
            <input id="tipo" type="number" placeholder="Tipo de territorio" class="form-control-sm mr-sm-2"
              maxlenght="2" pattern="/^(?:[1-9]|0[1-9]|10)$/">
          </div>
          <div class="form-inline">
            <label for="iden" class="col-sm-2 col-form-label"></label>
            <input id="iden" type="number" placeholder="Identificativo" class="form-control-sm mr-sm-2" maxlenght="3"
              pattern="/(?:\b|-)([1-9]{1,2}[0]?|300)\b/">
          </div>

          <div class="form-inline">
            <label for="fechaIni" class="col-sm-2 col-form-label"></label>
            <input id="fechaIni" type="date" placeholder="Fecha inicial" class="form-control-sm mr-sm-2">
          </div>

          <div class="form-inline">
          <label for="fechaFin" class="col-sm-2 col-form-label"></label>
          <input id="fechaFin" type="date" placeholder="Fecha fin"  class="form-control-sm mr-sm-2">
        </div>

          <div class="form-inline">
            <label for="cuando" class="col-sm-2 col-form-label"></label>
            <input id="cuando" type="text" placeholder="mañana/tarde/noche" class="form-control-sm mr-sm-2" maxlenght="50" pattern="[A-Za-zÑñÁÉÍÓúáéíóúÇç\s]">
          </div>

          <div class="form-inline">
            <label for="empleado" class="col-sm-2 col-form-label"></label>
            <input id="empleado" type="number" placeholder="Comercial" class="form-control-sm mr-sm-2" maxlenght="3"
              pattern="/^{1-120}\d+$/">
          </div>

          <div class="form-inline">
            <button id="dato" class="btn btn-dark my-2 my-sm-0 btn-sm">Datos</button>
          </div>
      </nav>
    </form>
      <button class="btn btn-info my-3" id="guardar">Guardar</button>
      <div id="act"></div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">Tipo</th>
            <th scope="col">Iden</th>
            <th scope="col">FechaIni</th>
            <th scope="col">FechaFin</th>
            <th scope="col">Cuando</th>
            <th scope="col">Comercial</th>
          </tr>
        </thead>
        <tbody id="tabla">
        </tbody>
      </table>
    `;
    cargarTabla();
    $("#dato").html(`<button id="dato" class="btn btn-danger btn-sm ml-2">Cerrar sesión</button>`);
    var ce = document.getElementById("dato");
    ce.addEventListener("click", dato, false);
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

function cargarTabla() {
  db.collection("teritorios").onSnapshot(function (querySnapshot) {
    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    querySnapshot.forEach(function (doc) {
      tabla.innerHTML += `
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().tipo}</td>
          <td>${doc.data().iden}</td>
          <td>${doc.data().fechaIni}</td>
          <td>${doc.data().fechaFin}</td>
          <td>${doc.data().cuando}</td>
          <td>${doc.data().comercial}</td>
        </tr>
      `;
    });
  });
}

function cerrar() {
  firebase.auth().signOut()
    .then(function () {
      console.log("Saliendo...");
      $("#botones").css("visibility", "visible");
      $("#cerrarconexion").css("display", "none");
      contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
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


function guardarTerritorios() {
  tipo = document.getElementById("tipo").value;
  iden = document.getElementById("iden").value;
  fechaIni = document.getElementById("fechaIni").value;
  fechaIni = document.getElementById("fechaFin").value;
  cuando = document.getElementById("cuando").value;
  comercial == document.getElementById("comercial").value;
  if (tipo.trim() === "" || iden.trim() === "" || fechaIni.trim() === "" || fechaFin.trim() === "" || cuando.trim() === "" || comercial.trim() === "") {
    alert("Todos los datos son obligatorios.");
  } else {
    var territorios = {
      tipo: tipo,
      iden: iden,
      fechaIni: fechaIni,
      fechaIni: fechaFin,
      cuando: cuando,
      comercial: comercial
    };
  }
}

// Lectura de los documentos


// Borrar datos de documentos
function borrarDatos(parId, parTipo, parIden,parfechaIni, parfechaFin, parCuando, parComercial) {
  var re = confirm("¿Está seguro que quiere borrar este usuario: " + parNombre + ' ' + parApellido + ''+ parTipo + '' + parIden + '' + parfechaIni + '' +  parfechaFin + '' +  parCuando+ '' + parComercial + "?");
  if (re == true) {
    db.collection("territorios").doc(parId).delete()
      .then(function () {
        console.log("Dato borrado correctamente.");
      }).catch(function (error) {
        console.error("Error: ", error);
      });
  }
}


function fechaIni() {
  var fechaIni = document.getElementById("fechaIni").value;

  fechaIni = new Date(fechaIni.split("/").reverse().join("/"));
  if (fechaIni > new Date()) {
    console.log("dato incorrecto");
  } else {
    console.log("dato correcto");
  }
}

var tipo = function tipo() {
  if (/^(?:[1-9]|0[1-9]|10)$/) {
    return true
  } else {
    return false
  }

}

var tipo = function tipo() {
  if (/^(?:[1-9]|0[1-9]|10)$/) {
    return true
  } else {
    return false
  }
}

observador();

/*
// Editar datos de documentos
function editarDatos(parId, parTipo, parIden,parfechaIni, parfechaFin, parCuando, parComercial) {
  document.getElementById("tipo").value = parTipo;
  document.getElementById("iden").value = parIden
  document.getElementById("fechaIni").value= parfechaIni;
  document.getElementById("fechaFin").value= parfechaFin;
  document.getElementById("cuando").value = parCuando;
  document.getElementById("comercial").value= parComercial;

  $("#guardar").css("display", "none");
  $(".linea").attr("disabled", true);
  $("#act").append("<button class='btn btn-info my-3' id='actualizar'>Guardar</button>");
  $("#actualizar").on("click", function () {
    var userRef = db.collection("territorios").doc(parId);
    tipo = document.getElementById("tipo").value;
    iden = document.getElementById("iden").value;
    fechaIni = document.getElementById("fechaIni").value;
    fechaIni = document.getElementById("fechaFin").value;
    cuando = document.getElementById("cuando").value;
    comercial == document.getElementById("comercial").value;

    if (nombre.trim() === "" || apellido.trim() === "" || nacimiento.trim() === "") {
      alert("Todos los datos son obligatorios.");
    } else {
      return userRef.update({
        tipo = document.getElementById("tipo").value;
        iden = document.getElementById("iden").value;
        fechaIni = document.getElementById("fechaIni").value;
        fechaIni = document.getElementById("fechaFin").value;
        cuando = document.getElementById("cuando").value;
        comercial = document.getElementById("comercial").value;
        })
      .then(function () {
          console.log("Usuario actualizado correctamente.");
          document.getElementById("nombre").value = "";
          document.getElementById("tipo").value= "";
          document.getElementById("iden").value ="";
          document.getElementById("fechaIni").value= "";
          document.getElementById("fechaFin").value= "";
          document.getElementById("cuando").value ="";
          document.getElementById("comercial").value= "";
          $("#guardar").css("display", "inline");
          $(".linea").attr("disabled", false);
          $("#act").empty();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error actualizando usuario: ", error);
        });
    }
  })
} */