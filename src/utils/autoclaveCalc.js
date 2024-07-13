require("dotenv").config();
const conn = require("../database/conn");
const { calculoVolumeTotalDiarioPorLead, getAllLeadIds } = require('./calculadora');

async function percentUtilization(id){
  let connection;
  try {
      connection = await conn();
      //consulta leads
      const queryLead = `SELECT 
              intervaloPicoCME
          FROM \`lead\` WHERE id = ?`;
      const [resultsLead] = await connection.query(queryLead, [id]);

      if (resultsLead.length === 0) {
        return null;
      }

      const intervaloPicoCME = resultsLead[0].intervaloPicoCME

      //consulta autoclaves
      const queryAutoclave = `SELECT 
              tempoCargaDescargaMin,
              medTotTempoCicloATMin,
              tempoTestDiarioBDMin,
              tempoDiarioAquecimentoMaqMin,
              numAutoclaves,
              volumeUtilCamaraLt
          FROM \`autoclave\` WHERE id = ?`;
      const [resultsAutoclave] = await connection.query(queryAutoclave, [id]);

      if (resultsAutoclave.length === 0) {
        return null;
      }

      let {
        tempoCargaDescargaMin,
        medTotTempoCicloATMin,
        tempoTestDiarioBDMin,
        tempoDiarioAquecimentoMaqMin,
        numAutoclaves,
        volumeUtilCamaraLt
      } = resultsAutoclave[0];

      /*console.log(`tempoCargaDescargaMin: ${tempoCargaDescargaMin}`);
      console.log(`medTotTempoCicloATMin: ${medTotTempoCicloATMin}`);
      console.log(`tempoTestDiarioBDMin: ${tempoTestDiarioBDMin}`);
      console.log(`tempoDiarioAquecimentoMaqMin: ${tempoDiarioAquecimentoMaqMin}`);
      console.log(`numAutoclaves: ${numAutoclaves}`);
      console.log(`volumeUtilCamaraLt: ${volumeUtilCamaraLt}`);*/
      

      //calculos
      let intervaloDiarioPicoMin = (intervaloPicoCME * 60) - 
      (tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin)

      let tempoClicloCarDescMin = tempoCargaDescargaMin + medTotTempoCicloATMin

      let numMaxCiclosIntervaloPico = intervaloDiarioPicoMin / tempoClicloCarDescMin

      let capProcessamIntervaloPicoTodasAutoclavesOnLt = 
      numAutoclaves * 
      volumeUtilCamaraLt * 
      numMaxCiclosIntervaloPico

      let volumeTotalDiarioPorLead = await calculoVolumeTotalDiarioPorLead(id);
      if (volumeTotalDiarioPorLead === null) {
        return null;
      }

      let volumeProcessadoIntervaloPicoLt90totDiario = volumeTotalDiarioPorLead * 0.9 
      let capUtilizTodasAutoclavesIntervaloPicoPorcent = 
      Math.round(((volumeProcessadoIntervaloPicoLt90totDiario / capProcessamIntervaloPicoTodasAutoclavesOnLt) * 100) * 100) / 100; //deixar duas casas decimais

      /*console.log(`tempoClicloCarDescMin: ${tempoClicloCarDescMin}`);
      console.log(`capProcessamIntervaloPicoTodasAutoclavesOnLt: ${capProcessamIntervaloPicoTodasAutoclavesOnLt}`); // precisa arredondar
      console.log(`volumeTotalDiarioPorLead: ${volumeTotalDiarioPorLead}`);*/ // precisa arredondar


      return {capUtilizTodasAutoclavesIntervaloPicoPorcent}
    } catch (err) {
      console.error("Erro ao executar a consulta:", err);
      throw err;
    } finally {
      if (connection) {
        await connection.end();
      }
    }
}

async function horasTrabalhoAtenderVolTotal(id){
  let connection;
  try {
      connection = await conn();
      //consulta leads
      const queryAutoclave = `SELECT 
              tempoClicloCarDescMin,
              tempoTestDiarioBDMin,
              tempoDiarioAquecimentoMaqMin,
              numAutoclavesUmaEmManutencao,
              volumeUtilCamaraLt
          FROM \`autoclave\` WHERE id = ?`;
      const [resultsAutoclave] = await connection.query(queryAutoclave, [id]);

      if (resultsAutoclave.length === 0) {
        return null;
      }

      let {
        tempoClicloCarDescMin,
        tempoTestDiarioBDMin,
        tempoDiarioAquecimentoMaqMin,
        numAutoclavesUmaEmManutencao,
        volumeUtilCamaraLt
      } = resultsAutoclave[0];

      //calculos

      let volumeTotalDiarioPorLead = await calculoVolumeTotalDiarioPorLead(id);
      if (volumeTotalDiarioPorLead === null) {
        return null;
      }

      let horasTrabalhoAtenderVolTotalHr = Math.round(((( 
      volumeTotalDiarioPorLead / volumeUtilCamaraLt ) 
      * tempoClicloCarDescMin ) + 
      tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin ) / 60)
      / numAutoclavesUmaEmManutencao // tirar a casa decimal

      /*console.log(`volumeTotalDiarioPorLead: ${volumeTotalDiarioPorLead}`);
      console.log(`tempoClicloCarDescMin: ${tempoClicloCarDescMin}`);
      console.log(`tempoTestDiarioBDMin: ${tempoTestDiarioBDMin}`);
      console.log(`tempoDiarioAquecimentoMaqMin: ${tempoDiarioAquecimentoMaqMin}`);
      console.log(`numAutoclavesUmaEmManutencao: ${numAutoclavesUmaEmManutencao}`);
      console.log(`volumeUtilCamaraLt: ${volumeUtilCamaraLt}`);*/

      // =((((C51/C57)*C47)+C48+C49)/60)/C60
      return { horasTrabalhoAtenderVolTotalHr }
    } catch (err) {
      console.error("Erro ao executar a consulta:", err);
      throw err;
    } finally {
      if (connection) {
        await connection.end();
      }
    }
}

/*async function recomendaçõesPorLead() {

  if (percentUtilization < 90 && horasTrabalhoAtenderVolTotal < 20) {
    console.log('As marcas recomendadas são', )
  } else {
    //instrução aqui  
  }

}*/


async function visualizarResultados() {
    try {
      const ids = await getAllLeadIds();
      const resultados = [];
  
      for (const id of ids) {
        const resultadoPercent = await percentUtilization(id);
        const resultadoHr = await horasTrabalhoAtenderVolTotal(id);
        resultados.push(resultadoPercent, resultadoHr);
      }
      console.log("Resultados:", resultados);
    } catch (err) {
      console.error("Erro ao calcular o volume total diário por lead:", err);
    }
  }

  visualizarResultados();


module.exports = {
  horasTrabalhoAtenderVolTotal,
  percentUtilization
};