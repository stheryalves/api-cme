require("dotenv").config();
const conn = require("../database/conn");
const { getAllLeadIds } = require('./calculadora');

async function percentUtilization(id) {
  let connection;
  try {
    connection = await conn();
    //consulta leads
    const queryLead = `SELECT 
              intervaloPicoCME,
              estimativaVolumeTotalDiarioInstrumentalLt
          FROM \`lead\` WHERE id = ?`;
    const [resultsLead] = await connection.query(queryLead, [id]);

    if (resultsLead.length === 0) {
      return null;
    }

    const { intervaloPicoCME, estimativaVolumeTotalDiarioInstrumentalLt } = resultsLead[0];

    //consulta autoclaves
    const queryAutoclaves = `SELECT * FROM \`autoclave\``;
    const [resultsAutoclaves] = await connection.query(queryAutoclaves);

    if (resultsAutoclaves.length === 0) {
      return null;
    }

    let resultados = [];

    for (const autoclave of resultsAutoclaves) {
      let {
        id,
        tempoCargaDescargaMin,
        medTotTempoCicloATMin,
        tempoTestDiarioBDMin,
        tempoDiarioAquecimentoMaqMin,
        numAutoclaves,
        volumeUtilCamaraLt,
        volumeTotCamaraLt
      } = autoclave;

      //entra na tabela de autoclave
      let tempoClicloCarDescMin = tempoCargaDescargaMin + medTotTempoCicloATMin // inserir no banco autoclave 60 min
      let tempoDisponivelDiarioMin = (24 * 60) - (tempoDiarioAquecimentoMaqMin + tempoTestDiarioBDMin) // 1390
      let numMaxCiclosDia = tempoDisponivelDiarioMin / tempoClicloCarDescMin // 23.17
      let aproveitamentoCamaraPorcent = (volumeUtilCamaraLt / volumeTotCamaraLt) * 100 // 79
      let numAutoclavesUmaEmManutencao = numAutoclaves - 1 // 2
      //Fazer as contas e enviar para autoclave
      console.log(`tempoDisponivelDiarioMin: ${tempoDisponivelDiarioMin}`)
      console.log('numMaxCiclosDia:', numMaxCiclosDia)
      console.log('aproveitamentoCamaraPorcent:', aproveitamentoCamaraPorcent)
      console.log('numAutoclavesUmaEmManutencao:', numAutoclavesUmaEmManutencao)

      //entra na tabela de lead
      let intervaloDiarioPicoMin = (intervaloPicoCME * 60) -
        (tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin) //// inserir no banco lead 670

      let numMaxCiclosIntervaloPico = intervaloDiarioPicoMin / tempoClicloCarDescMin // inserir no banco de lead

      let capProcessamIntervaloPicoTodasAutoclavesOnLt =
        numAutoclaves *
        volumeUtilCamaraLt *
        numMaxCiclosIntervaloPico // inserir no banco lead

      let volumeProcessadoIntervaloPicoLt90totDiario = estimativaVolumeTotalDiarioInstrumentalLt * 0.9 // inserir no banco de lead
      let capUtilizTodasAutoclavesIntervaloPicoPorcent = // inserir no banco de lead
        Math.round(((volumeProcessadoIntervaloPicoLt90totDiario / capProcessamIntervaloPicoTodasAutoclavesOnLt) * 100) * 100) / 100;

      const updateQueryLead = `UPDATE \`lead\` SET 
        intervaloDiarioPicoMin = ?,
        numMaxCiclosIntervaloPico = ?,
        capProcessamIntervaloPicoTodasAutoclavesOnLt = ?, 
        volumeProcessadoIntervaloPicoLt90totDiario = ?, 
        capUtilizTodasAutoclavesIntervaloPicoPorcent = ?
      WHERE id = ?`;

      await connection.query(updateQueryLead, [ //falta incluir uma variavel na tabela 
        intervaloDiarioPicoMin,
        numMaxCiclosIntervaloPico,
        capProcessamIntervaloPicoTodasAutoclavesOnLt,
        volumeProcessadoIntervaloPicoLt90totDiario,
        capUtilizTodasAutoclavesIntervaloPicoPorcent,
        id
      ]);

      const updateQueryAutoclave = `UPDATE \`autoclave\` SET      
        tempoClicloCarDescMin = ?,
        tempoDisponivelDiarioMin = ?,
        numMaxCiclosDia = ?,
        aproveitamentoCamaraPorcent = ?,
        numAutoclavesUmaEmManutencao = ?
      WHERE id = ?`;

      await connection.query(updateQueryAutoclave, [ //faltam incluir 3 variaveis na tabela
        tempoClicloCarDescMin,
        tempoDisponivelDiarioMin,
        numMaxCiclosDia,
        aproveitamentoCamaraPorcent,
        numAutoclavesUmaEmManutencao,
        id
      ]);

      resultados.push({
        autoclaveId: autoclave.id,
        capUtilizTodasAutoclavesIntervaloPicoPorcent //deixar duas casas decimais 
      });
    }

    return resultados;
  } catch (err) {
    console.error("Erro ao executar a consulta:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function horasTrabalhoAtenderVolTotal(id) {
  let connection;
  try {
    connection = await conn();
    const queryLead = `SELECT 
              estimativaVolumeTotalDiarioInstrumentalLt
          FROM \`lead\` WHERE id = ?`;
    const [resultsLead] = await connection.query(queryLead, [id]);

    if (resultsLead.length === 0) {
      return null;
    }

    const estimativaVolumeTotalDiarioInstrumentalLt = resultsLead[0].estimativaVolumeTotalDiarioInstrumentalLt

    const queryAutoclaves = `SELECT * FROM \`autoclave\``;
    const [resultsAutoclaves] = await connection.query(queryAutoclaves);

    if (resultsAutoclaves.length === 0) {
      return null;
    }

    let resultados = [];
    for (const autoclave of resultsAutoclaves) {
      let {
        id,
        tempoClicloCarDescMin,
        tempoTestDiarioBDMin,
        tempoDiarioAquecimentoMaqMin,
        numAutoclavesUmaEmManutencao,
        volumeUtilCamaraLt
      } = autoclave;

      //entra na tabela de lead
      let horasTrabalhoAtenderVolTotalHr = Math.floor((((
        estimativaVolumeTotalDiarioInstrumentalLt / volumeUtilCamaraLt)
        * tempoClicloCarDescMin) +
        tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin) / 60)
        / numAutoclavesUmaEmManutencao // inserir esse valor no banco de lead

      const updateQueryLead = `UPDATE \`lead\` SET  
      horasTrabalhoAtenderVolTotalHr = ?
    WHERE id = ?`;

      await connection.query(updateQueryLead, [
        horasTrabalhoAtenderVolTotalHr,
        id
      ]);

      resultados.push({
        autoclaveId: autoclave.id,
        horasTrabalhoAtenderVolTotalHr //arredondar
      });
    }

    return resultados;
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