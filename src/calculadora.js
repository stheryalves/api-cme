require("dotenv").config();
const conn = require("./database/conn");

async function getAllLeadIds() {
  let connection;
  try {
    connection = await conn();
    const query = `SELECT id FROM \`lead\``;
    const [results] = await connection.query(query);
    return results.map((row) => row.id);
  } catch (err) {
    console.error("Erro ao obter os IDs dos leads:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function calculoVolumeTotalDiarioPorLead(id) {
  let connection;
  try {
    connection = await conn();
    const query = `SELECT 
            numeroSalasCirurgias, 
            numeroCirurgiaSalaDia, 
            numeroLeitoUTI, 
            numeroLeitoInternacao, 
            numeroLeitoRPA,
            numeroLeitoObs,
            numeroLeitoHospitalDia,
            tipoProcessamento
        FROM \`lead\` WHERE id = ?`;
    const [results] = await connection.query(query, [id]);

    if (results.length === 0) {
      return null;
    }

    const UE = 54;
    const volumePorCirurgia = 1.5;
    const volumePorLeitoUtiDiario = 0.5;
    const volumePorLeitoInternacaoDiario = 0.05;

    const row = results[0];

    let numeroSalasCirurgias = row.numeroSalasCirurgias;
    let numeroCirurgiaSalaDia = row.numeroCirurgiaSalaDia;
    let numeroLeitoUTI = row.numeroLeitoUTI;
    let numeroLeitoInternacao = row.numeroLeitoInternacao;
    let numeroLeitoRPA = row.numeroLeitoRPA;
    let numeroLeitoObs = row.numeroLeitoObs;
    let numeroLeitoHospitalDia = row.numeroLeitoHospitalDia;
    let numCirurgiasDia = numeroSalasCirurgias * numeroCirurgiaSalaDia;

    let numLeitosTotais =
      numeroLeitoUTI +
      numeroLeitoInternacao +
      numeroLeitoRPA +
      numeroLeitoObs +
      numeroLeitoHospitalDia;
    let volumeTotalDiarioCirurgias = numCirurgiasDia * volumePorCirurgia;
    let volumeTotalDiarioUTIs = numeroLeitoUTI * volumePorLeitoUtiDiario;
    let volumeTotalDiarioInternacao =
      (numLeitosTotais - numeroLeitoUTI) * volumePorLeitoInternacaoDiario;

    let estimativaVolumeTotalDiarioInstrumentalUE =
      volumeTotalDiarioInternacao +
      volumeTotalDiarioUTIs +
      volumeTotalDiarioCirurgias;
    let estimativaVolumeTotalDiarioInstrumentalLt =
      estimativaVolumeTotalDiarioInstrumentalUE * UE;
    let tipoProcessamento = row.tipoProcessamento;

    if (tipoProcessamento == 0) {
      console.log("0 true = ✅ Ele processa tecidos");
      return {
        id: id,
        volumeTotalDiarioInternacao:
          Math.ceil(volumeTotalDiarioInternacao * 10) / 10,
        estimativaVolumeTotalDiarioInstrumentalUE:
          Math.ceil(estimativaVolumeTotalDiarioInstrumentalUE * 2 * 10) / 10,
        estimativaVolumeTotalDiarioInstrumentalLt:
          Math.ceil(estimativaVolumeTotalDiarioInstrumentalLt * 2 * 10) / 10,
        tipoProcessamento: true,
      };
    } else {
      console.log("1 false = ❌ Ele não processa tecidos");
      return {
        id: id,
        volumeTotalDiarioInternacao:
          Math.ceil(volumeTotalDiarioInternacao * 10) / 10,
        estimativaVolumeTotalDiarioInstrumentalUE:
          Math.ceil(estimativaVolumeTotalDiarioInstrumentalUE * 10) / 10,
        estimativaVolumeTotalDiarioInstrumentalLt:
          Math.ceil(estimativaVolumeTotalDiarioInstrumentalLt * 10) / 10,
        tipoProcessamento: false,
      };
    }
  } catch (err) {
    console.error("Erro ao executar a consulta:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function visualizarResultados() {
  try {
    const ids = await getAllLeadIds();
    const resultados = [];

    for (const id of ids) {
      const resultado = await calculoVolumeTotalDiarioPorLead(id);
      resultados.push(resultado);
    }
    console.log("Resultados:", JSON.stringify(resultados, null, 2));
  } catch (err) {
    console.error("Erro ao calcular o volume total diário por lead:", err);
  }
}

visualizarResultados();
