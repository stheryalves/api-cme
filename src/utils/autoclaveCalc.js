/*const conn = require("../database/conn");
const calculoVolumeTotalDiarioPorLead = require('./calculadora');

async function percentUtilization(){
    let connection;
    try {
        connection = await conn();
        const queryLead = `SELECT 
                intervaloPicoCME
            FROM \`lead\` WHERE id = ?`;
        const [resultsLead] = await connection.query(queryLead, [id]);
        const queryAutoclave = `SELECT 
                tempoCargaDescargaMin,
                medTotTempoCicloATMin,
                tempoTestDiarioBDMin,
                tempoDiarioAquecimentoMaqMin,
                intervaloDiarioPicoMin,
                numAutoclaves,
                volumeUtilCamaraLt
            FROM \`autoclave\` WHERE id = ?`;
        const [resultsAutoclave] = await connection.query(queryAutoclave, [id]);

    intervaloDiarioPicoMin = (intervaloPicoCME * 60) - 
    (tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin)

    tempoClicloCarDescMin = tempoCargaDescargaMin + medTotTempoCicloATMin

    numMaxCiclosIntervaloPico = intervaloDiarioPicoMin / tempoClicloCarDescMin

    capProcessamIntervaloPicoTodasAutoclavesOnLt = 
    numAutoclaves * 
    volumeUtilCamaraLt * 
    numMaxCiclosIntervaloPico

    volumeProcessadoIntervaloPicoLt90totDiario = calculoVolumeTotalDiarioPorLead() * 0.9 // ???
    capUtilizTodasAutoclavesIntervaloPicoPorcent = volumeProcessadoIntervaloPicoLt90totDiario / capProcessamIntervaloPicoTodasAutoclavesOnLt
    }
}

/*async function horasTrabalhoAtenderVolTotalHr(){

}

//todo recomendações
async function recomendaçõesPorLead() {

}*/


/*async function visualizarResultados() {
    try {
      const ids = await getAllLeadIds();
      const resultados = [];
  
      for (const id of ids) {
        const resultado = await recomendaçõesPorLead(id);
        resultados.push(resultado);
      }
      console.log("Resultados:", JSON.stringify(resultados, null, 2));
    } catch (err) {
      console.error("Erro ao calcular o volume total diário por lead:", err);
    }
  }

  visualizarResultados();*/