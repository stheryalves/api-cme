require("dotenv").config();
const conn = require("../database/conn");
const { getAllLeadIds } = require('./calculadora');

async function percentUtilizationAutoclave(id) {
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

    const { intervaloPicoCME } = resultsLead[0];
    
    const queryCalc = `SELECT 
              estimativaVolumeTotalDiarioInstrumentalLt
          FROM \`calculos_projeto\` WHERE id = ?`;
    const [resultsCalc] = await connection.query(queryCalc, [id]);

    if (resultsCalc.length === 0) {
      return null;
    }

    const { estimativaVolumeTotalDiarioInstrumentalLt } = resultsCalc[0];

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
      let tempoClicloCarDescMin = tempoCargaDescargaMin + medTotTempoCicloATMin // 60 min
      let tempoDisponivelDiarioMin = (24 * 60) - (tempoDiarioAquecimentoMaqMin + tempoTestDiarioBDMin) // 1390
      let numMaxCiclosDia = tempoDisponivelDiarioMin / tempoClicloCarDescMin // 23.17
      let aproveitamentoCamaraPorcent = (volumeUtilCamaraLt / volumeTotCamaraLt) * 100 // 79
      let numAutoclavesUmaEmManutencao = numAutoclaves - 1 // 2

      //entra na tabela de lead
      let intervaloDiarioPicoMin = (intervaloPicoCME * 60) -
        (tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin) // 670

      let numMaxCiclosIntervaloPico = intervaloDiarioPicoMin / tempoClicloCarDescMin

      let capProcessamIntervaloPicoTodasAutoclavesOnLt =
        numAutoclaves *
        volumeUtilCamaraLt *
        numMaxCiclosIntervaloPico

      let volumeProcessadoIntervaloPicoLt90totDiario = estimativaVolumeTotalDiarioInstrumentalLt * 0.9
      let capUtilizTodasAutoclavesIntervaloPicoPorcent =
        Math.round(((volumeProcessadoIntervaloPicoLt90totDiario / capProcessamIntervaloPicoTodasAutoclavesOnLt) * 100) * 100) / 100;

      const insertQueryCalc = `INSERT INTO \`calculos_autoclave\` (
        intervaloDiarioPicoMin,
        numMaxCiclosIntervaloPico,
        capProcessamIntervaloPicoTodasAutoclavesOnLt, 
        volumeProcessadoIntervaloPicoLt90totDiario, 
        capUtilizTodasAutoclavesIntervaloPicoPorcent,
        \`lead\`
      ) VALUES (?, ?, ?, ?, ?, ?)`;

      try {
        await connection.query(insertQueryCalc, [
          intervaloDiarioPicoMin,
          numMaxCiclosIntervaloPico,
          capProcessamIntervaloPicoTodasAutoclavesOnLt,
          volumeProcessadoIntervaloPicoLt90totDiario,
          capUtilizTodasAutoclavesIntervaloPicoPorcent,
          id
        ]);
        console.log('Dados inseridos com sucesso.');
      } catch (err) {
        console.error('Erro ao inserir dados:', err);
        throw err;
      }

      const insertQueryAutoclave = `INSERT INTO \`autoclave\` (
        id,      
        tempoClicloCarDescMin,
        tempoDisponivelDiarioMin,
        numMaxCiclosDia,
        aproveitamentoCamaraPorcent,
        numAutoclavesUmaEmManutencao
      ) VALUES (? , ? , ? , ? , ?, ?)`;
    
      try{
      await connection.query(insertQueryAutoclave, [
        id,
        tempoClicloCarDescMin,
        tempoDisponivelDiarioMin,
        numMaxCiclosDia,
        aproveitamentoCamaraPorcent,
        numAutoclavesUmaEmManutencao
      ]);
      console.log('Dados inseridos com sucesso.');
      } catch (err) {
        console.error('Erro ao inserir dados:', err);
        throw err;
      }

      resultados.push({
        autoclaveId: autoclave.id,
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
    const queryCalc = `SELECT 
              estimativaVolumeTotalDiarioInstrumentalLt
          FROM \`calculos_projeto\` WHERE id = ?`;
    const [resultsCalc] = await connection.query(queryCalc, [id]);

    if (resultsCalc.length === 0) {
      return null;
    }

    const estimativaVolumeTotalDiarioInstrumentalLt = resultsCalc[0].estimativaVolumeTotalDiarioInstrumentalLt

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
        / numAutoclavesUmaEmManutencao

      const updateQueryLead = `INSERT INTO \`calculos_autoclave\` (  
                horasTrabalhoAtenderVolTotalHr
            )VALUES ( ? )`;

      await connection.query(updateQueryLead, [
        horasTrabalhoAtenderVolTotalHr,
        id
      ]);

      resultados.push({
        autoclaveId: autoclave.id,
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
    const query = `SELECT marcaAutoclave FROM \`autoclave\``;
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
    const query = `SELECT modeloAutoclave FROM \`autoclave\``;
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