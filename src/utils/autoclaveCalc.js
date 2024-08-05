require("dotenv").config();
const conn = require("../database/conn");
const { getAllLeadIds } = require('./calculadora');

async function percentUtilizationAutoclave(id) {
  let connection;
  try {
    connection = await conn();

    // Verifica se o lead existe
    const queryLeadExistence = `SELECT COUNT(*) as count FROM \`lead\` WHERE id = ?`;
    const [resultsLeadExistence] = await connection.query(queryLeadExistence, [id]);

    if (resultsLeadExistence[0].count === 0) {
      throw new Error(`Lead with id ${id} does not exist.`);
    }

    // Consulta leads
    const queryLead = `SELECT intervaloPicoCME FROM \`lead\` WHERE id = ?`;
    const [resultsLead] = await connection.query(queryLead, [id]);

    if (resultsLead.length === 0) {
      return null;
    }

    const { intervaloPicoCME } = resultsLead[0];
    
    const queryCalc = `SELECT estimativaVolumeTotalDiarioInstrumentalLt FROM calculo_projeto WHERE id = ?`;
    const [resultsCalc] = await connection.query(queryCalc, [id]);

    if (resultsCalc.length === 0) {
      return null;
    }

    const { estimativaVolumeTotalDiarioInstrumentalLt } = resultsCalc[0];

    // Consulta autoclaves
    const queryAutoclaves = `SELECT * FROM autoclave`;
    const [resultsAutoclaves] = await connection.query(queryAutoclaves);

    if (resultsAutoclaves.length === 0) {
      return null;
    }

    let resultados = [];

    for (const autoclave of resultsAutoclaves) {
      const {
        id: autoclaveId,
        tempoCargaDescargaMin,
        medTotTempoCicloATMin,
        tempoTestDiarioBDMin,
        tempoDiarioAquecimentoMaqMin,
        numAutoclaves,
        volumeUtilCamaraLt,
        volumeTotCamaraLt
      } = autoclave;

      const tempoClicloCarDescMin = tempoCargaDescargaMin + medTotTempoCicloATMin;
      const tempoDisponivelDiarioMin = (24 * 60) - (tempoDiarioAquecimentoMaqMin + tempoTestDiarioBDMin);
      const numMaxCiclosDia = tempoDisponivelDiarioMin / tempoClicloCarDescMin;
      const aproveitamentoCamaraPorcent = (volumeUtilCamaraLt / volumeTotCamaraLt) * 100;
      const numAutoclavesUmaEmManutencao = numAutoclaves - 1;

      const intervaloDiarioPicoMin = (intervaloPicoCME * 60) - (tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin);
      const numMaxCiclosIntervaloPico = intervaloDiarioPicoMin / tempoClicloCarDescMin;

      const capProcessamIntervaloPicoTodasAutoclavesOnLt = numAutoclaves * volumeUtilCamaraLt * numMaxCiclosIntervaloPico;
      const volumeProcessadoIntervaloPicoLt90totDiario = estimativaVolumeTotalDiarioInstrumentalLt * 0.9;
      const capUtilizTodasAutoclavesIntervaloPicoPorcent = Math.round(((volumeProcessadoIntervaloPicoLt90totDiario / capProcessamIntervaloPicoTodasAutoclavesOnLt) * 100) * 100) / 100;

      // Verifica se já existe um registro na tabela calculo_autoclave
      const queryCheck = `SELECT COUNT(*) as count FROM calculo_autoclave WHERE lead_autoclave = ?`;
      const [resultsCheck] = await connection.query(queryCheck, [id]);

      if (resultsCheck[0].count > 0) {
        // Se existir, faz um UPDATE
        const updateQueryCalc = `UPDATE calculo_autoclave SET
          intervaloDiarioPicoMin = ?,
          numMaxCiclosIntervaloPico = ?,
          capProcessamIntervaloPicoTodasAutoclavesOnLt = ?, 
          volumeProcessadoIntervaloPicoLt90totDiario = ?, 
          capUtilizTodasAutoclavesIntervaloPicoPorcent = ?
        WHERE lead_autoclave = ?`;

        await connection.query(updateQueryCalc, [
          intervaloDiarioPicoMin,
          numMaxCiclosIntervaloPico,
          capProcessamIntervaloPicoTodasAutoclavesOnLt,
          volumeProcessadoIntervaloPicoLt90totDiario,
          capUtilizTodasAutoclavesIntervaloPicoPorcent,
          id
        ]);
      } else {
        // Se não existir, faz um INSERT
        const insertQuery = `INSERT INTO calculo_autoclave (
          intervaloDiarioPicoMin,
          numMaxCiclosIntervaloPico,
          capProcessamIntervaloPicoTodasAutoclavesOnLt,
          volumeProcessadoIntervaloPicoLt90totDiario,
          capUtilizTodasAutoclavesIntervaloPicoPorcent,
          lead_autoclave
      ) VALUES (?, ?, ?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE
          intervaloDiarioPicoMin = VALUES(intervaloDiarioPicoMin),
          numMaxCiclosIntervaloPico = VALUES(numMaxCiclosIntervaloPico),
          capProcessamIntervaloPicoTodasAutoclavesOnLt = VALUES(capProcessamIntervaloPicoTodasAutoclavesOnLt),
          volumeProcessadoIntervaloPicoLt90totDiario = VALUES(volumeProcessadoIntervaloPicoLt90totDiario),
          capUtilizTodasAutoclavesIntervaloPicoPorcent = VALUES(capUtilizTodasAutoclavesIntervaloPicoPorcent)`;

        await connection.query(insertQuery, [
          intervaloDiarioPicoMin,
          numMaxCiclosIntervaloPico,
          capProcessamIntervaloPicoTodasAutoclavesOnLt,
          volumeProcessadoIntervaloPicoLt90totDiario,
          capUtilizTodasAutoclavesIntervaloPicoPorcent,
          id
        ]);
      }

      const updateQueryAutoclave = `UPDATE autoclave SET
          tempoClicloCarDescMin = ?,
          tempoDisponivelDiarioMin = ?,
          numMaxCiclosDia = ?,
          aproveitamentoCamaraPorcent = ?,
          numAutoclavesUmaEmManutencao = ?
        WHERE id = ?`;

      await connection.query(updateQueryAutoclave, [
        tempoClicloCarDescMin,
        tempoDisponivelDiarioMin,
        numMaxCiclosDia,
        aproveitamentoCamaraPorcent,
        numAutoclavesUmaEmManutencao,
        autoclaveId
      ]);

      resultados.push({
        autoclaveId,
        capUtilizTodasAutoclavesIntervaloPicoPorcent
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

    // Verifica se o lead existe na tabela calculo_autoclave
    const queryLeadExistence = `SELECT COUNT(*) as count FROM calculo_autoclave WHERE lead_autoclave = ?`;
    const [resultsLeadExistence] = await connection.query(queryLeadExistence, [id]);

    if (resultsLeadExistence[0].count === 0) {
      throw new Error(`Lead with id ${id} does not exist in calculo_autoclave.`);
    }

    // Consulta estimativa de volume total diário
    const queryCalc = `SELECT estimativaVolumeTotalDiarioInstrumentalLt FROM calculo_projeto WHERE id = ?`;
    const [resultsCalc] = await connection.query(queryCalc, [id]);

    if (resultsCalc.length === 0) {
      return null;
    }

    const estimativaVolumeTotalDiarioInstrumentalLt = resultsCalc[0].estimativaVolumeTotalDiarioInstrumentalLt;

    // Consulta autoclaves
    const queryAutoclaves = `SELECT * FROM autoclave`;
    const [resultsAutoclaves] = await connection.query(queryAutoclaves);

    if (resultsAutoclaves.length === 0) {
      return null;
    }

    let resultados = [];
    for (const autoclave of resultsAutoclaves) {
      const {
        id: autoclaveId,
        tempoClicloCarDescMin,
        tempoTestDiarioBDMin,
        tempoDiarioAquecimentoMaqMin,
        numAutoclavesUmaEmManutencao,
        volumeUtilCamaraLt
      } = autoclave;

      let horasTrabalhoAtenderVolTotalHr = Math.floor(((
        estimativaVolumeTotalDiarioInstrumentalLt / volumeUtilCamaraLt) *
        tempoClicloCarDescMin +
        tempoTestDiarioBDMin +
        tempoDiarioAquecimentoMaqMin) / 60) / numAutoclavesUmaEmManutencao;

      // Atualiza a tabela calculo_autoclave
      const updateQueryLead = `UPDATE calculo_autoclave SET  
                horasTrabalhoAtenderVolTotalHr = ?
              WHERE lead_autoclave = ?`;

      await connection.query(updateQueryLead, [
        horasTrabalhoAtenderVolTotalHr,
        id
      ]);

      resultados.push({
        autoclaveId,
        horasTrabalhoAtenderVolTotalHr
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

async function getAllBrandsAutoclaves() {
  let connection;
  try {
    connection = await conn();
    const query = `SELECT marcaAutoclave FROM autoclave`;
    const [results] = await connection.query(query);
    return results.map((row) => row.marcaAutoclave);
  } catch (err) {
    console.error("Erro ao obter as marcas:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllModelsAutoclaves() {
  let connection;
  try {
    connection = await conn();
    const query = `SELECT modeloAutoclave FROM autoclave`;
    const [results] = await connection.query(query);
    return results.map((row) => row.modeloAutoclave);
  } catch (err) {
    console.error("Erro ao obter os modelos:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function autoclaveRecommendationByLead() {
  try {
    const ids = await getAllLeadIds(); //id de todos os leads
    const marcas = await getAllBrandsAutoclaves();
    const modelos = await getAllModelsAutoclaves();
    const resultados = [];

    for (const id of ids) { //calcula por lead percentResults e horasResults
      const percentResults = await percentUtilizationAutoclave(id);
      const horasResults = await horasTrabalhoAtenderVolTotal(id);

      for (let i = 0; i < percentResults.length; i++) { //executa a contição enquanto houver valores no array percentual
        const percentResult = percentResults[i];
        const horasResult = horasResults[i];

        if (percentResult.capUtilizTodasAutoclavesIntervaloPicoPorcent < 90 &&
          horasResult.horasTrabalhoAtenderVolTotalHr < 20) {
          const autoclaveId = percentResult.autoclaveId;
          const modeloAutoclave = modelos[autoclaveId];
          const marcaAutoclave = marcas[autoclaveId];

          resultados.push({
            leadId: id,
            marcaId: marcaAutoclave,
            modeloId: modeloAutoclave,
            autoclaveId: percentResult.autoclaveId,
            percentUtilizationAutoclave: percentResult.capUtilizTodasAutoclavesIntervaloPicoPorcent,
            horasTrabalhoAtenderVolTotal: horasResult.horasTrabalhoAtenderVolTotalHr
          });
        }
      }
    }

    const recomendacoes = resultados.slice(0, 3);

    console.log("Resultados:", recomendacoes);
    return recomendacoes;
  } catch (err) {
    console.error("Erro ao calcular as recomendações:", err);
    throw err;
  }
}

async function visualizarResultados() {
  try {
    const ids = await getAllLeadIds();
    const resultados = [];

    for (const id of ids) {
      //const resultadoPercent = await percentUtilizationAutoclave(id);
      //const resultadoHr = await horasTrabalhoAtenderVolTotal(id);
      const resultadoRecomendacoesAuto = await autoclaveRecommendationByLead(id);
      //resultados.push(resultadoPercent, resultadoHr, resultadoRecomendacoesAuto);
      resultados.push(resultadoRecomendacoesAuto);
    }
    console.log("Recomendações:", resultados);
  } catch (err) {
    console.error("Erro ao calcular o volume total diário por lead:", err);
  }
}

visualizarResultados();


module.exports = {
  horasTrabalhoAtenderVolTotal,
  percentUtilizationAutoclave,
  autoclaveRecommendationByLead
};