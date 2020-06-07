<template>
  <b-container class="container">
    <h1 class="title">Cargar Horas</h1>
    <b-form>
      <b-form-group label="Personal:" label-class="text-left" label-cols-lg="1">
        <b-row class="inputs" align-v="center">
          <b-col cols="4">
            <b-form-input
              id="inputPersona"
              v-model="inputPersona"
              required
            ></b-form-input>
          </b-col>
          <b-col cols="7">
            <b-form-input
              tabindex="-1"
              label=""
              v-model="showPersona"
              readonly=""
            ></b-form-input>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group label="Fecha:" label-class="text-left" label-cols-lg="1">
        <b-col class="inputs" cols="4">
          <b-form-datepicker
            id="example-datepicker"
            v-model="inputFecha"
            required
          ></b-form-datepicker>
        </b-col>
      </b-form-group>
      <b-form-group>
        <b-row align-h="start" class="rowWidth">
          <b-col class="inputRow" cols="2">
            <label class="labelAlignLeft" for="horaInicio">Hora inicio:</label>
          </b-col>
          <b-col cols="3" class="noPaddingLeft">
            <b-form-timepicker
              id="horaInicio"
              :state="estadoHI"
              v-model="inputHI"
              class="mb-2"
              required
            ></b-form-timepicker>
          </b-col>
          <b-col class="inputRow" cols="1">
            <label class="labelAlignLeft" for="horaFin">Hora fin:</label>
          </b-col>
          <b-col cols="3">
            <b-form-timepicker
              id="horaFin"
              :state="estadoHF"
              v-model="inputHF"
              locale="de"
              class="mb-2"
              required
            ></b-form-timepicker>
          </b-col>
          <b-col class="inputRow" cols="1">
            <label class="labelAlignLeft" for="minutos">Minutos:</label>
          </b-col>
          <b-col class="inputmin" cols="1">
            <b-form-input
              tabindex="-1"
              id="minutos"
              v-model="showMins"
              readonly
            ></b-form-input>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group label="Cliente:" label-class="text-left" label-cols-lg="1">
        <b-row class="inputs" align-v="center">
          <b-col cols="4">
            <b-form-input
              id="inputCliente"
              v-model="inputCliente"
              required
            ></b-form-input>
          </b-col>
          <b-col cols="7">
            <b-form-input
              tabindex="-1"
              label=""
              v-model="showCliente"
              readonly
            ></b-form-input>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group>
        <b-row align-v="center" class="rowWidth">
          <b-col class="inputRow" cols="2">
            <label class="labelAlignLeft">Clasificación:</label>
          </b-col>
          <b-col cols="3">
            <b-form-select
              v-model="selectedClasif"
              :options="optionsClasif"
              required
            ></b-form-select>
          </b-col>
          <b-col class="inputRow" cols="1">
            <label class="labelAlignLeft">Tipo:</label>
          </b-col>
          <b-col cols="3">
            <b-form-select
              v-model="selectedTipo"
              :options="optionsTipo"
              required
            ></b-form-select>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group label="Nota:" label-class="text-left" label-cols-lg="1">
        <b-col class="inputs" cols="11">
          <b-form-textarea
            id="textarea"
            v-model="nota"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-col>
      </b-form-group>
      <div>
        <b-alert
          :show="errorSubmit"
          class="text-left"
          variant="danger"
          dismissible
          @dismissed="errorSubmit = false"
        >
          <p>Errores:</p>

          <ul>
            <li
              :key="index"
              class="text-left"
              v-for="(error, index) in errores"
            >
              {{ error }}
            </li>
          </ul>
        </b-alert>
      </div>
      <b-row class="buttons">
        <b-button type="submit" @click.prevent="submit" variant="primary"
          >Guardar</b-button
        >
        <b-button type="cancel" @click.prevent="cancel" variant="danger"
          >Cancelar</b-button
        >
      </b-row>
      <div>
        <b-alert id="cancelAlert" variant="warning" :show="cancelStatus">
          <p>
            ¿Seguro que quiere cancelar?
          </p>

          <div id="cancelBtns">
            <b-button id="cancelSi" href="/" variant="warning">Si</b-button>
            <b-button
              id="cancelNo"
              @click="cancelStatus = false"
              variant="warning"
              >No</b-button
            >
          </div>
        </b-alert>
      </div>
      <!-- <b-row class="flex" align-v="center">
        <b-col align-self="center" class="label" cols="1">
          <label>Personal:</label>
        </b-col>
        <b-col cols="4">
          
        </b-col>
        <b-col cols="7"
          >
        </b-col>
      </b-row> -->
    </b-form>
  </b-container>
</template>

<script>
var moment = require("moment"); // require
moment().format();
export default {
  name: "cargaHoras",
  data() {
    return {
      inputPersona: "",
      showPersona: "",
      inputFecha: null,
      estadoHI: null,
      estadoHF: null,
      inputCliente: "",
      showCliente: "",
      clienteResp: null,
      inputHI: "",
      auxHI: "",
      inputHF: "",
      auxHF: "",
      showMins: "-.-",
      selectedClasif: null,
      optionsClasif: [{ value: null, text: "Seleccione clasificación..." }],
      selectedTipo: null,
      optionsTipo: [{ value: null, text: "Seleccione tipo..." }],
      nota: "",
      cancelStatus: false,
      errores: [],
      errorSubmit: false,
    };
  },
  mounted() {
    this.getClasif();
    this.getTipo();
  },
  methods: {
    getClasif() {
      fetch("http://127.0.0.1:4010/horas-clasif")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((elem) => {
            this.optionsClasif = [
              ...this.optionsClasif,
              { value: elem.id, text: elem.nombre },
            ];
          });
        })
        .catch((e) => console.log(e));
    },
    getTipo() {
      fetch("http://127.0.0.1:4010/horas-tipos")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((elem) => {
            this.optionsTipo = [
              ...this.optionsTipo,
              { value: elem.id, text: elem.nombre },
            ];
          });
        })
        .catch((e) => console.log(e));
    },
    submit() {
      console.log(
        this.inputPersona,
        this.inputFecha,
        this.inputHI,
        this.inputHF,
        this.selectedClasif,
        this.selectedTipo,
        this.nota
      );

      this.checkErrores();
      if (this.errores.length > 0) {
        this.errorSubmit = true;
        return;
      }
      // let payload = {
      //   clasificación: {},
      //   tipo: {},
      //   horaInicio: `${this.inputFecha}T${this.inputHI}-0300`,
      //   horaFin: `${this.inputFecha}T${this.inputHF}-0300`,
      //   duracion_min: this.showMins,
      // };

      // fetch("http://127.0.0.1:4010/horas", {
      //   method: "POST",
      //    // data can be `string` or {object}!
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((data) => console.log(data))
      //   .catch((error) => console.error("Error:", error));
    },
    cancel() {
      this.cancelStatus = true;
    },
    cancelDismiss() {
      this.cancelStatus = false;
    },
    checkErrores() {
      this.errores = [];
      if (!this.inputPersona) {
        this.errores = [...this.errores, "ingrese ID de Personal"];
      }
      if (this.inputPersona && !this.showPersona) {
        this.errores = [...this.errores, "No se encontró ID de Personal"];
      }
      if (!this.inputFecha) {
        this.errores = [...this.errores, "Ingrese fecha"];
      }
      if (!this.inputHI) {
        this.errores = [...this.errores, "Ingrese hora de inicio"];
      }
      if (!this.inputHF) {
        this.errores = [...this.errores, "Ingrese hora de fin"];
      }
      if (this.auxHI > this.auxHF) {
        this.errores = [
          ...this.errores,
          "hora de inicio posterior a hora de fin",
        ];
      }
      if (!this.inputCliente) {
        this.errores = [...this.errores, "ingrese ID de cliente"];
      }
      if (this.inputCliente && !this.showCliente) {
        this.errores = [...this.errores, "No se encontró ID de cliente"];
      }
      if (!this.selectedClasif) {
        this.errores = [...this.errores, "Seleccione clasificación"];
      }
      if (!this.selectedTipo) {
        this.errores = [...this.errores, "Seleccione tipo"];
      }
    },
  },
  watch: {
    inputPersona() {
      fetch(`http://127.0.0.1:4010/empleados?legajo=${this.inputPersona}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.content[0].legajo == this.inputPersona) {
            this.showPersona =
              "Entidad: " + data.content[0].entidad.razon_social;
          } else {
            this.showPersona = "";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    inputCliente() {
      //   let clientes;
      fetch(`http://127.0.0.1:4010/clientes?codigo=${this.inputCliente}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.clienteResp = data._embedded;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    clienteResp() {
      this.clienteResp.clienteResources.forEach((cliente) => {
        if (cliente.codigo == this.inputCliente) {
          this.showCliente = `Nombre: ${cliente.nombreFantasia} - Razón Social: ${cliente.razonSocial}`;
        } else {
          this.showCliente = "";
        }
      });
    },
    inputHI() {
      this.auxHI = moment(this.inputHI, "HH:mm:ss");

      if (this.auxHF != "") {
        if (this.auxHF < this.auxHI) {
          this.estadoHI = false;
          return 0;
        }
        this.estadoHI = null;
        this.estadoHF = null;
        this.showMins = (this.auxHF - this.auxHI) / 60000;
      }
    },
    inputHF() {
      this.auxHF = moment(this.inputHF, "HH:mm:ss");
      if (this.auxHI != "") {
        if (this.auxHF < this.auxHI) {
          this.estadoHF = false;
          return 0;
        }

        this.estadoHF = null;
        this.estadoHI = null;

        this.showMins = (this.auxHF - this.auxHI) / 60000;
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 25px;
  border: 2px solid rgb(65, 63, 63);
  border-radius: 12px;
  background-color: rgb(201, 201, 201);
}
.label {
  margin-top: 10px;
}
.title {
  margin-bottom: 20px;
}

.inputs {
  margin-left: 5px;
}
.inputRow {
  display: flex;
  align-items: center;
  justify-content: left;
  max-width: 115px;
  padding: 0px;
}
.labelAlignLeft {
  text-align: left !important;
  padding: 0px;
}
.buttons {
  margin: 10px auto;
  justify-items: center;
  align-items: center;
  max-width: 30%;
  justify-content: center;
}
.buttons > button {
  margin-left: 10px;
}

.inputInline {
  padding-left: 10px;
}
.rowWidth {
  max-width: 1086px;
  margin: 0px;
  max-height: 38px;
}
.noPaddingLeft {
  padding-left: 0px;
}
#cancelAlert {
  padding-right: 20px;
}
#cancelBtns {
  display: flex;
  justify-content: center;
}
#cancelNo {
  margin-left: 15px;
}
</style>
