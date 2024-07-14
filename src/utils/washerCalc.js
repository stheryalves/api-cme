require("dotenv").config();
const conn = require("../database/conn");
const { getAllLeadIds } = require('./calculadora');

async function percentUtilization(id) {
  let connection;
  try {
    connection = await conn();
    //consulta leads
    const queryLead = `SELECT 
              numeroLeitoUTI,
              estimativaVolumeTotalDiárioMaterial,
              numCirurgiasDia
          FROM \`lead\` WHERE id = ?`;
    const [resultsLead] = await connection.query(queryLead, [id]);

    if (resultsLead.length === 0) {
      return null;
    }

    const numeroLeitoUTI = resultsLead[0].numeroLeitoUTI
    const estimativaVolumeTotalDiárioMaterial = resultsLead[0].estimativaVolumeTotalDiárioMaterial
    const numCirurgiasDia = resultsLead[0].numCirurgiasDia

    //consulta lavadoras
    const queryWasher = `SELECT 
              capacidadeCargaBandejasInstrumentos,
              capacidadeCargaTraqueias,
              tempMedCicloInstrumentosCargaMaxMin,
              tempMedCicloAssisVentCargaMaxMin,
              numBandejasPorUe,
              intervaloMedEntreCiclos,
              qtdTraqueiasCirurgia,
              qtdTraqueiasLeitoUtiDia,
              quantidadeTermosProjeto
          FROM \`lavadora\` WHERE id = ?`;
    const [resultsWasher] = await connection.query(queryWasher, [id]);

    if (resultsWasher.length === 0) {
      return null;
    }

    let {
      capacidadeCargaBandejasInstrumentos,
      capacidadeCargaTraqueias,
      tempMedCicloInstrumentosCargaMaxMin,
      tempMedCicloAssisVentCargaMaxMin,
      numBandejasPorUe,
      intervaloMedEntreCiclos,
      qtdTraqueiasCirurgia,
      qtdTraqueiasLeitoUtiDia,
      quantidadeTermosProjeto
    } = resultsWasher[0];

    //calculos
    let capacidadeProcessamUeCargaInstrumentos =
      capacidadeCargaBandejasInstrumentos /
      numBandejasPorUe


    let numCiclosInstrumentosDia =
      Math.floor(estimativaVolumeTotalDiárioMaterial /
        capacidadeProcessamUeCargaInstrumentos)

    let tempProcessamDemandaInstrumentosMin = numCiclosInstrumentosDia *
      (tempMedCicloInstrumentosCargaMaxMin + intervaloMedEntreCiclos)

    let qtdTraqueiasDia = numCirurgiasDia * qtdTraqueiasCirurgia
    let qtdTraqueiasUtiDia = numeroLeitoUTI * qtdTraqueiasLeitoUtiDia
    let qtdTotTraqueiasDia = qtdTraqueiasDia + qtdTraqueiasUtiDia
    let qtdCiclosAssistVentDia = qtdTotTraqueiasDia / capacidadeCargaTraqueias
    let tempProcessamDemandaAssistVentMin = qtdCiclosAssistVentDia *
      (tempMedCicloAssisVentCargaMaxMin +
        intervaloMedEntreCiclos)

    let demandaTempoDiaMin = tempProcessamDemandaInstrumentosMin +
      tempProcessamDemandaAssistVentMin
    let minutosDisponiveisTodosEquipamDia = 60 * 24 * quantidadeTermosProjeto
    let percentualUtilizacaoCapacidadeMax = Math.round(((demandaTempoDiaMin /
      minutosDisponiveisTodosEquipamDia) * 100) * 100) / 100

    return { percentualUtilizacaoCapacidadeMax }
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
      resultados.push(resultadoPercent);
    }
    console.log("Resultados:", resultados);
  } catch (err) {
    console.error("Erro ao calcular o volume total diário por lead:", err);
  }
}

visualizarResultados();


module.exports = {
  percentUtilization
};