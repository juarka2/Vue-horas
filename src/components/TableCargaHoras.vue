<template>
  <div id="tableContainer">
    <b-table
      striped
      hover=""
      fixed
      dark
      :small="isSmall"
      id="tableCargaHoras"
      :fields="CHFields"
      :items="CHItems"
      sticky-header="100px"
      thClass="thNoBorder"
      responsive
    ></b-table>
  </div>
</template>

<script>
const $ = require("jquery");

window.$ = $;
export default {
  name: "TableCargaHoras",
  props: ["Personal", "Fecha"],
  data() {
    return {
      CHFields: [
        "Hora_inicio",
        "Hora_fin",
        "Minutos",
        "Cód_cliente",
        "Cliente",
        "Clasificación",
        "Tipo",
      ],
      CHItems: [{}, {}, {}],
      response: [],
      isSmall: false,
    };
  },
  methods: {
    getFields() {
      fetch(
        `http://127.0.0.1:4010/horas?empleado=${this.Personal}&fecha_desde=${this.Fecha}&fecha_hasta=${this.Fecha}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            this.CHItems = [];
            data.content.forEach((element) => {
              let fechaElem = element.horaInicio.substring(0, 10);

              if (fechaElem === this.Fecha && element.id == this.Personal) {
                this.response = [...this.response, element];
                this.CHItems = [
                  ...this.CHItems,
                  {
                    Hora_inicio: fechaElem,
                    Hora_fin: fechaElem,
                    Minutos: element.duracion_min,
                    Cód_client: "",
                    Cliente: "",
                    Clasificación: element.clasificacion.id,
                    Tipo: element.tipo.id,
                  },
                ];
              }
            });
            // this.smallTableTrue();
          } else {
            this.CHItems = [{}, {}, {}];
            this.smallTableFalse();
          }
          if (this.response.length === 0) {
            this.CHItems = [{}, {}, {}];
            this.smallTableFalse();
          }
        })
        .catch((e) => console.log(e));
    },
    smallTableTrue() {
      this.isSmall = true;
    },
    smallTableFalse() {
      this.isSmall = false;
    },
  },
  watch: {
    Personal() {
      if (this.Fecha) {
        this.getFields();
      }
    },
    Fecha() {
      if (this.Personal) {
        this.getFields();
      }
    },
  },
  mounted() {
    $("#tableCargaHoras").css({
      "border-radius": "12px",
    });
  },
};
</script>

<style scoped>
#tableContainer {
  /* padding: 0px 87px 0px 91px; */
  padding: 0px 7.8% 0px 8.5%;
  font-size: 0.9rem;
}
b-table {
  border-radius: 5px;
}
</style>
