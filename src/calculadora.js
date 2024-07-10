require('dotenv').config();
const conn = require('./database/conn');

async function calculoVolumeTotalDiarioPorLead() {
    let connection;
    try {
        connection = await conn(); // Obtém a conexão com o banco de dados
        const query = `SELECT 
        numeroSalasCirurgias, 
        numeroCirurgiaSalaDia, 
        numeroLeitoUTI, 
        numeroLeitoInternacao, 
        numeroLeitoRPA,
        numeroLeitoObs,
        numeroLeitoHospitalDia
        FROM \`lead\` WHERE id = 1`;
        const [results] = await connection.query(query, [1]); // Substitua '1' pelo ID desejado

        const UE = 54;
        const volumePorCirurgia = 1.5;
        const volumePorLeitoUtiDiario = 0.5;
        const volumePorLeitoInternacaoDiario = 0.05;

        const calculos = results.map(row => {

            let numeroSalasCirurgias = row.numeroSalasCirurgias;
            let numeroCirurgiaSalaDia = row.numeroCirurgiaSalaDia;
            let numeroLeitoUTI = row.numeroLeitoUTI;
            let numeroLeitoInternacao = row.numeroLeitoInternacao;
            let numeroLeitoRPA = row.numeroLeitoRPA;
            let numeroLeitoObs = row.numeroLeitoObs;
            let numeroLeitoHospitalDia = row.numeroLeitoHospitalDia;
            let numCirurgiasDia = numeroSalasCirurgias * numeroCirurgiaSalaDia;

            let numLeitosTotais = numeroLeitoUTI + numeroLeitoInternacao + numeroLeitoRPA + numeroLeitoObs + numeroLeitoHospitalDia;
            let volumeTotalDiarioCirurgias = numCirurgiasDia * volumePorCirurgia;
            let volumeTotalDiarioUTIs = numeroLeitoUTI * volumePorLeitoUtiDiario;
            let volumeTotalDiarioInternacao = (numLeitosTotais - numeroLeitoUTI) * volumePorLeitoInternacaoDiario;

            let estimativaVolumeTotalDiarioInstrumentalUE = volumeTotalDiarioInternacao + volumeTotalDiarioUTIs + volumeTotalDiarioCirurgias;
            let estimativaVolumeTotalDiarioInstrumentalLt = estimativaVolumeTotalDiarioInstrumentalUE * UE;

            return { 
                volumeTotalDiarioInternacao: Math.ceil(volumeTotalDiarioInternacao * 10) / 10, 
                estimativaVolumeTotalDiarioInstrumentalUE: Math.ceil(estimativaVolumeTotalDiarioInstrumentalUE * 10) / 10, 
                estimativaVolumeTotalDiarioInstrumentalLt: Math.ceil(estimativaVolumeTotalDiarioInstrumentalLt * 10) / 10 
            };
        });

        return calculos;

    } catch (err) {
        console.error('Erro ao executar a consulta:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.end(); // Fecha a conexão com o banco de dados
        }
    }
}

module.exports = { calculoVolumeTotalDiarioPorLead };

async function main() {
    try {
        const resultado = await calculoVolumeTotalDiarioPorLead();
        console.log('Respostas:', resultado);
    } catch (err) {
        console.error('Erro ao calcular o volume total diário por lead:', err);
    }
}

main();
