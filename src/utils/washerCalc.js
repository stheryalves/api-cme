require("dotenv").config();
const conn = require("../database/conn");
const { getAllLeadIds } = require('./calculadora');

async function percentUtilizationWasher(id) {
  let connection;
  try {
    connection = await conn();
    //consulta leads
    const queryLead = `SELECT 
              numeroLeitoUTI
          FROM \`lead\` WHERE id = ?`;
    const [resultsLead] = await connection.query(queryLead, [id]);

    if (resultsLead.length === 0) {
      return null;
    }

    const { numeroLeitoUTI } = resultsLead[0];

    //consulta lead_projeto
    const queryLeadProjeto = `SELECT
              numCirurgiasDia,
              estimativaVolumeTotalDiárioMaterial
          FROM calculo_projeto WHERE id = ?`;
    const [resultsLeadProjeto] = await connection.query(queryLeadProjeto, [id]);

    if (resultsLeadProjeto.length === 0) {
      return null;
    }

    const { numCirurgiasDia, estimativaVolumeTotalDiárioMaterial } = resultsLeadProjeto[0];

    //consulta lavadoras
    const queryWashers = `SELECT * FROM lavadora`;
    const [resultsWashers] = await connection.query(queryWashers);

    if (resultsWashers.length === 0) {
      return null;
    }

    let resultados = [];
    for (const washer of resultsWashers) {
      let {
        id,
        capacidadeCargaBandejasInstrumentos,
        capacidadeCargaTraqueias,
        tempMedCicloInstrumentosCargaMaxMin,
        tempMedCicloAssisVentCargaMaxMin,
        numBandejasPorUe,
        intervaloMedEntreCiclos,
        qtdTraqueiasCirurgia,
        qtdTraqueiasLeitoUtiDia,
        quantidadeTermosProjeto
      } = washer;

      //entra na tabela de lavadora
      let capacidadeProcessamUeCargaInstrumentos =
        capacidadeCargaBandejasInstrumentos /
        numBandejasPorUe // 5,0 

      //entra na tabela de lead
      let numCiclosInstrumentosDia =
        estimativaVolumeTotalDiárioMaterial /
        capacidadeProcessamUeCargaInstrumentos// 26

      let tempProcessamDemandaInstrumentosMin = numCiclosInstrumentosDia *
        (tempMedCicloInstrumentosCargaMaxMin + intervaloMedEntreCiclos) // 1826.3 

      let qtdTraqueiasDia = numCirurgiasDia * qtdTraqueiasCirurgia // 216 
      let qtdTraqueiasUtiDia = numeroLeitoUTI * qtdTraqueiasLeitoUtiDia // 90 
      let qtdTotTraqueiasDia = qtdTraqueiasDia + qtdTraqueiasUtiDia // 306 
      let qtdCiclosAssistVentDia = qtdTotTraqueiasDia / capacidadeCargaTraqueias // 17
      let demandaCiclosDia = qtdCiclosAssistVentDia + numCiclosInstrumentosDia // 43 
      let tempProcessamDemandaAssistVentMin = qtdCiclosAssistVentDia *
        (tempMedCicloAssisVentCargaMaxMin +
          intervaloMedEntreCiclos) // 1190

      let demandaTempoDiaMin = tempProcessamDemandaInstrumentosMin +
        tempProcessamDemandaAssistVentMin // 3016.3
      let minutosDisponiveisTodosEquipamDia = 60 * 24 * quantidadeTermosProjeto // 2880
      let percentualUtilizacaoCapacidadeMax = Math.round(((demandaTempoDiaMin /
        minutosDisponiveisTodosEquipamDia) * 100) * 100) / 100

      const updateQueryCalc = `UPDATE calculo_lavadora SET 
        capacidadeProcessamUeCargaInstrumentos = ?,
        numCiclosInstrumentosDia = ?,
        tempProcessamDemandaInstrumentosMin = ?, 
        qtdTraqueiasDia = ?, 
        qtdTraqueiasUtiDia = ?,
        qtdTotTraqueiasDia = ?,
        qtdCiclosAssistVentDia = ?,
        demandaCiclosDia = ?,
        tempProcessamDemandaAssistVentMin = ?,
        demandaTempoDiaMin = ?,
        minutosDisponiveisTodosEquipamDia = ?,
        percentualUtilizacaoCapacidadeMax = ?
      WHERE lead_washer = ?`;

      try {
        await connection.query(updateQueryCalc, [
          capacidadeProcessamUeCargaInstrumentos,
          numCiclosInstrumentosDia,
          tempProcessamDemandaInstrumentosMin,
          qtdTraqueiasDia,
          qtdTraqueiasUtiDia,
          qtdTotTraqueiasDia,
          qtdCiclosAssistVentDia,
          demandaCiclosDia,
          tempProcessamDemandaAssistVentMin,
          demandaTempoDiaMin,
          minutosDisponiveisTodosEquipamDia,
          percentualUtilizacaoCapacidadeMax,
          id
        ]);
        //console.log('Dados atualizados com sucesso.');
      } catch (err) {
        console.error('Erro ao atualizar dados:', err);
        throw err;
      }

      /*const insertQuery = `INSERT INTO \`calculo_lavadora\` (
        id,
        capacidadeProcessamUeCargaInstrumentos,
        numCiclosInstrumentosDia,
        tempProcessamDemandaInstrumentosMin,
        qtdTraqueiasDia,
        qtdTraqueiasUtiDia,
        qtdTotTraqueiasDia,
        qtdCiclosAssistVentDia,
        demandaCiclosDia,
        minutosDisponiveisTodosEquipamDia,
        percentualUtilizacaoCapacidadeMax,
        lead_washer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?) 
      ON DUPLICATE KEY UPDATE
          capacidadeProcessamUeCargaInstrumentos = VALUES(capacidadeProcessamUeCargaInstrumentos),
          numCiclosInstrumentosDia = VALUES(numCiclosInstrumentosDia),
          tempProcessamDemandaInstrumentosMin = VALUES(tempProcessamDemandaInstrumentosMin),
          qtdTraqueiasDia = VALUES(qtdTraqueiasDia),
          qtdTraqueiasUtiDia = VALUES(qtdTraqueiasUtiDia),
          qtdTotTraqueiasDia = VALUES(qtdTotTraqueiasDia),
          qtdCiclosAssistVentDia = VALUES(qtdCiclosAssistVentDia),
          demandaCiclosDia = VALUES(demandaCiclosDia),
          minutosDisponiveisTodosEquipamDia = VALUES(minutosDisponiveisTodosEquipamDia),
          percentualUtilizacaoCapacidadeMax = VALUES(percentualUtilizacaoCapacidadeMax)`;
  
      try {
        await connection.query(insertQuery, [
            id,
            capacidadeProcessamUeCargaInstrumentos,
            numCiclosInstrumentosDia,
            tempProcessamDemandaInstrumentosMin,
            qtdTraqueiasDia,
            qtdTraqueiasUtiDia,
            qtdTotTraqueiasDia,
            qtdCiclosAssistVentDia,
            demandaCiclosDia,
            minutosDisponiveisTodosEquipamDia,
            percentualUtilizacaoCapacidadeMax,
            id 
        ]);
        //console.log('Dados atualizados com sucesso.');
      } catch (err) {
        console.error('Erro ao atualizar dados:', err);
        throw err;
      }*/

      /*async function insertQuery(
        capacidadeProcessamUeCargaInstrumentos,
        numCiclosInstrumentosDia,
        tempProcessamDemandaInstrumentosMin,
        qtdTraqueiasDia,
        qtdTraqueiasUtiDia,
        qtdTotTraqueiasDia,
        qtdCiclosAssistVentDia,
        demandaCiclosDia,
        minutosDisponiveisTodosEquipamDia,
        percentualUtilizacaoCapacidadeMax,
        id,
        leadLavadora 
      ) {
        const insertQuery = `INSERT INTO \`calculo_lavadora\` (
          id,
          capacidadeProcessamUeCargaInstrumentos,
          numCiclosInstrumentosDia,
          tempProcessamDemandaInstrumentosMin,
          qtdTraqueiasDia,
          qtdTraqueiasUtiDia,
          qtdTotTraqueiasDia,
          qtdCiclosAssistVentDia,
          demandaCiclosDia,
          minutosDisponiveisTodosEquipamDia,
          percentualUtilizacaoCapacidadeMax,
          lead_washer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?) 
        ON DUPLICATE KEY UPDATE
            capacidadeProcessamUeCargaInstrumentos = VALUES(capacidadeProcessamUeCargaInstrumentos),
            numCiclosInstrumentosDia = VALUES(numCiclosInstrumentosDia),
            tempProcessamDemandaInstrumentosMin = VALUES(tempProcessamDemandaInstrumentosMin),
            qtdTraqueiasDia = VALUES(qtdTraqueiasDia),
            qtdTraqueiasUtiDia = VALUES(qtdTraqueiasUtiDia),
            qtdTotTraqueiasDia = VALUES(qtdTotTraqueiasDia),
            qtdCiclosAssistVentDia = VALUES(qtdCiclosAssistVentDia),
            demandaCiclosDia = VALUES(demandaCiclosDia),
            minutosDisponiveisTodosEquipamDia = VALUES(minutosDisponiveisTodosEquipamDia),
            percentualUtilizacaoCapacidadeMax = VALUES(percentualUtilizacaoCapacidadeMax)`;
    
        await connection.query(insertQuery, [
            id,
            capacidadeProcessamUeCargaInstrumentos,
            numCiclosInstrumentosDia,
            tempProcessamDemandaInstrumentosMin,
            qtdTraqueiasDia,
            qtdTraqueiasUtiDia,
            qtdTotTraqueiasDia,
            qtdCiclosAssistVentDia,
            demandaCiclosDia,
            minutosDisponiveisTodosEquipamDia,
            percentualUtilizacaoCapacidadeMax,
            id 
        ]);
      }
      
      await insertQuery(
        capacidadeProcessamUeCargaInstrumentos,
        numCiclosInstrumentosDia,
        tempProcessamDemandaInstrumentosMin,
        qtdTraqueiasDia,
        qtdTraqueiasUtiDia,
        qtdTotTraqueiasDia,
        qtdCiclosAssistVentDia,
        demandaCiclosDia,
        minutosDisponiveisTodosEquipamDia,
        percentualUtilizacaoCapacidadeMax,
        id,
        id
    );*/

      resultados.push({
        washerId: washer.id,
        percentualUtilizacaoCapacidadeMax
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

async function getAllBrandsWashers() {
  let connection;
  try {
    connection = await conn();
    const query = `SELECT marcaLavadora FROM lavadora`;
    const [results] = await connection.query(query);
    return results.map((row) => row.marcaLavadora);
  } catch (err) {
    console.error("Erro ao obter as marcas:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllModelsWashers() {
  let connection;
  try {
    connection = await conn();
    const query = `SELECT modeloLavadora FROM lavadora`;
    const [results] = await connection.query(query);
    return results.map((row) => row.modeloLavadora);
  } catch (err) {
    console.error("Erro ao obter os modelos:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function washersRecommendationByLead() {
  try {
    const ids = await getAllLeadIds(); //id de todos os leads
    const marcas = await getAllBrandsWashers();
    const modelos = await getAllModelsWashers();
    const resultados = [];

    for (const id of ids) { //calcula por lead percentResults
      const percentResults = await percentUtilizationWasher(id);

      for (let i = 0; i < percentResults.length; i++) { //executa a contição enquanto houver valores no array percentual
        const percentResult = percentResults[i];

        if (percentResult.percentualUtilizacaoCapacidadeMax < 90) {
          const washerId = percentResult.washerId;
          const modeloLavadora = modelos[washerId];
          const marcaLavadora = marcas[washerId];

          const percentResults = await percentUtilizationWasher(id);
          console.log(`Percent Results para Lavadoras para Lead ID ${id}:`, percentResults);

          resultados.push({
            leadId: id,
            marcaId: marcaLavadora,
            modeloId: modeloLavadora,
            washerId: percentResult.washerId,
            percentUtilizationWasher: percentResult.percentualUtilizacaoCapacidadeMax
          });
        }
      }
    }

    const recomendacoes = resultados.slice(0, 2);

    console.log("Recomendações:", recomendacoes);
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
      //const resultadoPercent = await percentUtilizationWasher(id);
      const resultadoRecomendacoesLav = await washersRecommendationByLead(id);
      //resultados.push(resultadoPercent);
      resultados.push(resultadoRecomendacoesLav);
    }
    console.log("Resultados:", resultados);
  } catch (err) {
    console.error("Erro ao calcular o volume total diário por lead:", err);
  }
}

visualizarResultados();


module.exports = {
  percentUtilizationWasher,
  washersRecommendationByLead
};