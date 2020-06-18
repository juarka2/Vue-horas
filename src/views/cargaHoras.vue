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
      <b-form-group label="Fecha:" label-class="text-left" label-cols="1">
        <b-input-group class="col-4 noPaddingLeft">
          <b-form-input
            id="example-input"
            v-model="inputFecha"
            type="text"
            placeholder="AAAA-MM-DD"
            autocomplete="off"
            required
            class="inputTextCenter"
          ></b-form-input>
          <b-input-group-append>
            <b-form-datepicker
              v-model="inputFecha"
              button-only
              right
              locale="es"
              aria-controls="example-input"
              @context="onContext"
            ></b-form-datepicker>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <TableCargaHoras
        :Fecha="inputFecha"
        :Personal="inputPersona"
      ></TableCargaHoras>

      <b-form-group>
        <b-row align-h="start" class="rowWidth">
          <b-col cols="1" class="inputRowLeft">
            <label class="labelAlignLeft" for="horaInicio">Hora inicio:</label>
          </b-col>
          <b-col class="noPaddingLeft" cols="3">
            <b-input-group>
              <b-form-input
                id="horaInicio"
                v-model="inputHI"
                :state="estadoHI"
                type="text"
                placeholder="HH:mm"
                class="inputTextCenter"
              ></b-form-input>
              <b-input-group-append>
                <b-form-timepicker
                  v-model="inputHI"
                  button-only
                  right
                  locale="es"
                  aria-controls="horaInicio"
                ></b-form-timepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col cols="1" class="inputRowCenter">
            <label class="labelAlignLeft" for="horaFin">Hora fin:</label>
          </b-col>
          <b-col cols="3" class="noPaddingLeft">
            <b-input-group>
              <b-form-input
                id="horaFin"
                v-model="inputHF"
                :state="estadoHF"
                type="text"
                placeholder="HH:mm"
                class="inputTextCenter"
              ></b-form-input>
              <b-input-group-append>
                <b-form-timepicker
                  v-model="inputHF"
                  button-only
                  right
                  locale="es"
                  aria-controls="horaFin"
                ></b-form-timepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col cols="2" class="inputRowCenter">
            <label class="labelAlignLeft" for="minutos">Minutos:</label>
          </b-col>
          <b-col cols="2" class="inputMin">
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
          <b-col class="inputRowLeft " cols="1">
            <label class="labelAlignLeft">Tipo:</label>
          </b-col>
          <b-col cols="3" class="noPaddingLeft">
            <b-form-select
              v-model="selectedTipo"
              :options="optionsTipo"
              required
            ></b-form-select>
          </b-col>
          <b-col class="inputRowCenter" cols="2">
            <label class="labelAlignLeft">Clasificación:</label>
          </b-col>
          <b-col cols="3">
            <b-form-select
              v-model="selectedClasif"
              :options="optionsClasif"
              required
            ></b-form-select>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group
        label="Ordenes de servicio:"
        label-class="text-left noPaddingLeft"
        label-cols-lg="1"
      >
        <div class="alignItemsCenter">
          <b-col class="inputs noPaddingLeft noPaddingRight" cols="11">
            <b-form-select
              v-model="selectedOrdenes"
              :options="optionsOrdenes"
            ></b-form-select>
          </b-col>
        </div>
      </b-form-group>
      <b-form-group label="Nota:" label-class="text-left" label-cols-lg="1">
        <b-col class="inputs noPaddingLeft noPaddingRight" cols="11">
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
          :show="saveSuccess"
          variant="success"
          id="saveAlert"
          dismissible
          @dismissed="saveSuccess = false"
          ><p>Guardado con éxito!</p>
        </b-alert>

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
    </b-form>
  </b-container>
</template>

<script>
var moment = require("moment");
moment().format();

import TableCargaHoras from "../components/TableCargaHoras";

export default {
  components: {
    TableCargaHoras,
  },
  name: "cargaHoras",
  data() {
    return {
      inputPersona: "",
      showPersona: "",
      inputFecha: null,
      selectedFecha: "",

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
      allClasif: [],
      allTipos: [],
      saveSuccess: false,
      selectedOrdenes: "",
      optionsOrdenes: [
        { value: null, text: "Seleccione orden de servicio..." },
      ],
      allOrdenes: [],
    };
  },
  mounted() {
    this.getClasif();
    this.getTipo();
  },
  methods: {
    onContext(ctx) {
      this.selectedFecha = ctx.selectedYMD;
    },
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
            this.allClasif = [...this.allClasif, elem];
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
            this.allTipos = [...this.allTipos, elem];
          });
        })
        .catch((e) => console.log(e));
    },
    submit() {
      this.saveSuccess = false;
      this.checkErrores();
      if (this.errores.length > 0) {
        this.errorSubmit = true;
        return;
      } else {
        this.errorSubmit = false;
      }
      let payload = {
        clasificación: this.allClasif[this.selectedClasif - 1],
        tipo: this.selectedTipo,
        horaInicio: `${this.inputFecha}T${this.inputHI}-0300`,
        horaFin: `${this.inputFecha}T${this.inputHF}-0300`,
        duracion_min: this.showMins.toString(),
      };

      fetch("http://127.0.0.1:4010/horas", {
        method: "POST",
        body: JSON.stringify(payload), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 201) {
            this.saveSuccess = true;
          }
        })
        .catch((e) => console.log(e));
    },
    ValidarHora(hora) {
      var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
        hora
      );

      return isValid;
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
      if (this.inputFecha && !this.selectedFecha) {
        this.errores = [...this.errores, "fecha no válida"];
      }
      if (!this.inputHI) {
        this.errores = [...this.errores, "Ingrese hora de inicio"];
      }
      if (this.inputHI && !this.ValidarHora(this.inputHI)) {
        this.errores = [...this.errores, "hora de inicio no válida"];
      }
      if (!this.inputHF) {
        this.errores = [...this.errores, "Ingrese hora de fin"];
      }
      if (this.inputHF && !this.ValidarHora(this.inputHF)) {
        this.errores = [...this.errores, "hora de fin no válida"];
      }
      if (!this.inputHI && this.inputHF && this.auxHI > this.auxHF) {
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
      if (!this.selectedOrdenes) {
        this.errores = [...this.errores, "Seleccione orden de servicio"];
      }
    },
    getOrdenes() {
      fetch(`http://127.0.0.1:4010/orden-servicio/cliente/${this.inputCliente}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          if (data) {
            this.allOrdenes = [...data];
            data.forEach((item) => {
              this.optionsOrdenes = [
                ...this.optionsOrdenes,
                {
                  value: item.id,
                  text: `ID: ${item.id} - ${item.descripcion}`,
                },
              ];
            });
          } else {
            this.allOrdenes = [];
            this.optionsOrdenes = [
              { value: null, text: "Seleccione orden de servicio..." },
            ];
          }
        })
        .catch((e) => console.log(e));
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
      this.getOrdenes();
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
label {
  margin-bottom: 0px;
}
.label {
  margin-top: 10px;
}
.title {
  margin-bottom: 20px;
}

/* .inputs {
  margin-left: 5px;
} */
.inputRowLeft {
  display: flex;
  align-items: center;
  justify-content: left;
  max-width: 115px;
  padding: 0px;
}
.inputRowCenter {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 115px;
  padding: 0px;
}
.inputMin {
  max-width: 16.2%;
}
.inputMin > input {
  text-align: center;
}
.labelAlignLeft {
  text-align: left !important;
  padding: 0px;
}
.inputTextCenter {
  text-align: center;
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
.noPaddingLeft {
  padding-left: 0px;
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
.noPaddingRight {
  padding-right: 0px;
}
#cancelAlert,
#saveAlert {
  padding-right: 20px;
}

#cancelBtns {
  display: flex;
  justify-content: center;
}
#cancelNo {
  margin-left: 15px;
}
.alignItemsCenter {
  display: flex;
  align-items: center;
  padding-top: 12px;
}
</style>
