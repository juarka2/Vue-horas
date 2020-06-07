<template>
  <div class="container">
    <h1>Carga de horas</h1>
    <form id="cargaForm" action="" method="post">
      <div id="row1">
        <p>Personal</p>
        <input
          v-model="personalText"
          type="number"
          name="personal"
          id="personal"
          style="margin: 0px 5px;"
        />
        <input
          v-model="personalOutput"
          type="text"
          name="personalShow"
          id="personalShow"
          readonly
          tabindex="-1"
        />
      </div>
      <div id="row2">
        <p>Fecha</p>
        <input type="date" name="fecha" id="fecha" />
      </div>
      <div id="row3">
        <p>Hora inicio</p>
        <input
          type="time"
          name="horaInicio"
          id="horaInicio"
          placeholder="hh:mm"
        />
        <p>Hora fin</p>
        <input type="time" name="horaFin" id="horaFin" placeholder="hh:mm" />
        <p>Minutos</p>
        <input
          type="time"
          name="horaFin"
          id="horaFin"
          placeholder="hh:mm"
          readonly
        />
        <br />
      </div>
      <div id="row4">
        <p>Cliente</p>
        <input type="text" name="cliente" id="cliente" />
        <input
          type="text"
          name="clienteShow"
          id="clienteShow"
          readonly
          tabindex="-1"
        />
      </div>
      <div id="row5">
        <p>Clasificación</p>
        <select name="clasificacion" id="clasificacion"></select>
        <p>Tipo</p>
        <select name="tipo" id="tipo"></select>
      </div>
      <div id="row6">
        <p>nota</p>
        <input type="text" name="nota" id="nota" tabindex="-1" />
      </div>
      <div id="row8">
        <input type="submit" value="guardar" />
        <input type="submit" value="cancelar" />
      </div>
    </form>
  </div>
</template>

<script>
const $ = require("jquery");
// Lo declaramos globalmente
window.$ = $;
export default {
  name: "cargaHoras",
  data() {
    return {
      personalText: "",
      personalOutput: "",
      clienteText: "",
    };
  },
  mounted() {
    console.log(this.personalText);
    this.getClasif();
    this.getTipo();
  },
  methods: {
    getClasif() {
      fetch("http://127.0.0.1:4010/horas-clasif")
        .then((res) => {
          //console.log(res.json());
          return res.json();
        })
        .then((data) => {
          let clasifMenu = $("#clasificacion");
          clasifMenu.append(
            "<option value=''>seleccione clasificación</option>"
          );
          data.forEach((element) => {
            let newOption = `<option value="${element.id}">${element.id}</option>`;
            clasifMenu.append(newOption);
          });
        });
    },
    getTipo() {
      fetch("http://127.0.0.1:4010/horas-tipos")
        .then((res) => {
          //console.log(res.json());
          return res.json();
        })
        .then((data) => {
          let tiposMenu = $("#tipo");
          tiposMenu.append("<option value=''>seleccione tipo</option>");
          data.forEach((element) => {
            let newOption = `<option value="${element.id}">${element.id}</option>`;
            tiposMenu.append(newOption);
          });
        });
    },
  },
  watch: {
    personalText() {
      fetch(`http://127.0.0.1:4010/empleados?legajo=${this.personalText}`)
        .then((res) => {
          //console.log(res.json());
          return res.json();
        })
        .then((data) => {
          console.log(data);
          console.log(this.personalText);
          if (data.content[0].legajo == this.personalText) {
            this.personalOutput =
              "entidad:" + data.content[0].entidad.razon_social;
          } else {
            this.personalOutput = "";
          }
        });
    },
  },
};
</script>

<style scoped>
#cargaForm {
  width: 60%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(8, 50px);
  grid-row-gap: 10px;
  padding: 20px 30px;
  text-align: start;
  background-color: aquamarine;
}

#cargaForm input {
  max-height: 25px;
}

#cargaForm > #row1 {
  display: flex;
  grid-column: 1/5;
  grid-row: 1/2;
}
#cargaForm > #row2 {
  display: flex;
  grid-column: 1/5;
  grid-row: 2/3;
}
#cargaForm > #row3 {
  display: flex;
  grid-column: 1/5;
  grid-row: 3/4;
}
#cargaForm > #row4 {
  display: flex;
  grid-column: 1/5;
  grid-row: 4/5;
}
#cargaForm > #row5 {
  display: flex;
  align-content: center;
  text-align: center;
  grid-column: 1/5;
  grid-row: 5/6;
}
#cargaForm > #row5 > p {
  text-align: center;

  margin-right: 10px;
}
#cargaForm > #row5 > select {
  text-align: center;
  line-height: 50px;
  max-height: 60%;
  margin-right: 10px;
}
#cargaForm > #row6 {
  display: flex;
  grid-column: 1/5;
  grid-row: 6/7;
}
#cargaForm > #row7 {
  display: flex;
  grid-column: 1/5;
  grid-row: 7/8;
}
#cargaForm > #row8 {
  display: flex;

  justify-content: center;
  align-content: center;
  grid-column: 1/5;
  grid-row: 8/9;
}
#cargaForm > #row8 > input {
  margin: 0px 5px;
}
</style>
