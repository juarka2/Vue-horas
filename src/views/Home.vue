<template>
  <div class="container">
    <h1 class="mt-3">Registros de horas</h1>
    <b-form @submit="onSubmit" id="form">
      <b-form-group id="group_desde" label="Fecha inicial:" label-for="input-1">
        <b-form-input
          id="input-1"
          type="date"
          v-model="fechaDesde"
          required
          placeholder="desde"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="group_hasta" label="Fecha final:" label-for="input-2">
        <b-form-input
          id="input-2"
          type="date"
          v-model="fechaHasta"
          required
          placeholder="hasta"
        ></b-form-input>
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        @submit="onSubmit"
        @keyup.enter="onSubmit"
        >Consultar horas</b-button
      >
    </b-form>

    <b-alert
      class="alert"
      :show="notFound"
      @dismissed="notFound = false"
      dismissible
    >
      No se encontraron resultados
    </b-alert>
    <b-alert
      class="alert"
      :show="errorFechas"
      variant="danger"
      @dismissed="errorFechas = false"
      dismissible
    >
      Fecha inicial es posterior a fecha final
    </b-alert>

    <b-table
      striped
      hover=""
      :fixed="isTrue"
      :dark="isTrue"
      id="table"
      :fields="fields"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      thClass="thNoBorder"
      responsive="sm"
    >
      <template v-slot:cell(ver)="data">
        <b-button v-if="isSet" @click="handleBtn(data.index)">Ver</b-button>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="table"
      first-number
      last-number
    ></b-pagination>
    <b-button user-router variant="primary" href="/cargar" id="agregarBtn"
      >Agregar registro</b-button
    >
  </div>
</template>

<script>
const $ = require("jquery");
// Lo declaramos globalmente
window.$ = $;
export default {
  name: "home",
  data: function() {
    return {
      isSet: false,
      errorFechas: false,
      notFound: false,
      currentPage: 1,
      perPage: 5,
      isTrue: true,
      fechaDesde: null,
      fechaHasta: null,
      pags: null,
      text: "",
      items: [{}, {}, {}, {}, {}],
      fields: [
        "Fecha",
        "Hora_inicio",
        "Hora_fin",
        "Minutos",
        "Clasificacion",
        "Tipo",
        "Cod_cliente",
        "ver",
      ],
    };
  },
  mounted() {
    $("#input-1").datepicker({
      autoclose: true,
      todayHighlight: true,
      dateFormat: "yyyy/mm/dd",
    });

    let elems = document.querySelectorAll("th");
    for (let i = 0; i < elems.length; i++) {
      elems[i].style.borderTopColor = "transparent";
    }
    $("#table").css({ "border-radius": "12px", "margin-top": "20px" });
  },
  computed: {
    rows() {
      return this.items.length;
    },
  },

  methods: {
    handleBtn(data) {
      console.log(data);
    },
    checkFechas() {
      if (this.fechaDesde > this.fechaHasta) {
        this.errorFechas = true;
        this.items = [{}, {}, {}, {}, {}];
        return false;
      } else {
        this.errorFechas = false;
        return true;
      }
    },
    onSubmit(e) {
      e.preventDefault();

      this.notFound = false;
      if (!this.fechaDesde || !this.fechaHasta) {
        this.items = [{}, {}, {}, {}, {}];
        return;
      }
      if (!this.checkFechas()) {
        return;
      }

      fetch("http://127.0.0.1:4010/horas")
        .then((res) => res.json())
        .then((data) => {
          this.items = [];
          let fechaInicio;
          let fechaFin;
          let FIaux;
          let FFaux;

          data.content.forEach((hora) => {
            fechaInicio = hora.horaInicio;
            fechaFin = hora.horaFin;

            fechaInicio = fechaInicio.substring(0, fechaInicio.indexOf("T"));

            fechaFin = fechaFin.substring(0, fechaFin.indexOf("T"));
            fechaInicio = new Date(fechaInicio);
            fechaFin = new Date(fechaFin);
            FIaux = new Date(this.fechaDesde);
            FFaux = new Date(this.fechaHasta);

            if (fechaInicio > FIaux && fechaFin < FFaux) {
              let HIaux = hora.horaInicio.substring(11, 19);
              let HFaux = hora.horaFin.substring(11, 19);

              let fechaAux = [];
              fechaAux[2] = hora.horaInicio.substring(0, 4);
              fechaAux[1] = hora.horaInicio.substring(5, 7);
              fechaAux[0] = hora.horaInicio.substring(8, 10);
              this.items = [
                ...this.items,
                {
                  Fecha: fechaAux.join("/"),
                  Hora_inicio: HIaux,
                  Hora_fin: HFaux,
                  Minutos: hora.duracion_min,
                  Clasificacion: hora.clasificacion.id,
                  Tipo: hora.tipo.id,
                  Cod_cliente: hora.id,
                  ver: this.items.length - 1,
                },
              ];
            }
            this.resultNotFound();
          });
          this.tdCSS();
        })
        .catch((err) => console.log(err));
    },
    resultNotFound() {
      if (this.items.length === 0) {
        this.items = [{}, {}, {}, {}, {}];
        this.notFound = true;
      } else {
        this.isSet = true;
        this.notFound = false;
      }
    },
    tdCSS() {
      $("td").css("vertical-align", "middle");
    },
  },
  watch: {
    fechaDesde() {
      this.errorFechas = false;
      this.notFound = false;
    },
    fechaHasta() {
      this.errorFechas = false;
      this.notFound = false;
    },
  },
};
// @ is an alias to /src
</script>

<style scoped>
.container {
  padding: 15px;
  border: 2px solid rgb(65, 63, 63);
  border-radius: 12px;
  background-color: rgb(201, 201, 201);
}
#form {
  display: flex;
  margin-top: 30px;
  align-items: flex-end;
  padding: 5px 20% 5px 14.5%;
  font-size: 1.3rem;
  max-width: 100%;
  justify-content: space-between;
}
#form > #group_desde,
#group_hasta {
  margin-right: 10px;
  margin-bottom: 0px;
  /* justify-items: center;
  justify-content: center;
  align-content: center; */
}

#group_desde > label {
  margin-top: 30px;
}
/* #table {
  margin-top: 200px;
  border-radius: 12px !important;
  border-color: rgb(201, 201, 201);
  vertical-align: middle;
}
#table > tr {
  min-height: 50px;
  border-radius: 12px;
  vertical-align: middle;
}
#table > th {
  border-top-color: transparent !important;
  border-radius: 12px;
  vertical-align: middle;
} */
#agregarBtn {
  margin-top: 50px;
}
.alert {
  margin-top: 10px;
}

td {
  vertical-align: middle !important;
}
b-table {
  border-radius: 5px;
}
</style>
