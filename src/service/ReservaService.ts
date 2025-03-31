import { error } from "console"
import { Reserva } from "../entity/Reserva"
import { ReservaRepository } from "../repository/ReservaRepository"
import { Database } from "../repository/Database"
import { Pool } from "pg"

export class ReservaService {

    private repo: ReservaRepository
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
        this.repo = new ReservaRepository()
    }
    mapear(row: any): Reserva {
        return new Reserva(row.idReserva, row.dataReserva, row.dataVolta, row.pago, row.emailUsuario, row.emailGuia, row.valor)
    }
    async listar(): Promise<Reserva[]> {
        const reservas = await this.repo.listar();
    
        console.log("Dados brutos vindos do banco:", reservas); // 🔍 Verifique como os dados estão vindo
    
        if (!reservas || reservas.length === 0) {
            return [];
        }
    
        return reservas.map(row => this.mapear(row));
    }

    async buscarPorId(id: number): Promise<Reserva | string> {
        const Reserva = await this.repo.buscarPorId(id)
        if (!Reserva) {
            return "Usuário não encontrado."
        }
        return Reserva
    }

    async criar(dados: Partial<Reserva>): Promise<Reserva | null> {
        const { idReserva, dataReserva, dataVolta, pago, emailUsuario, emailGuia, valor } = dados;
    
        if (!idReserva || !dataReserva || !dataVolta || !pago || !emailUsuario || !emailGuia || !valor) {
            throw new Error("Todos os campos são obrigatórios para criar uma reserva.");
        }
    
        console.log("Dados recebidos para criar reserva:", dados);  // <-- Adicione este log
    
        const query = `
            INSERT INTO guia.Reserva 
            (id_reserva, data_reserva, data_volta, pago, email_usuario, email_guia, valor) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    
        const valores = [idReserva, dataReserva, dataVolta, pago, emailUsuario, emailGuia, valor];
    
        try {
            const { rows } = await this.pool.query(query, valores);
            console.log("Reserva inserida no banco:", rows[0]);  // <-- Adicione este log
            return this.mapear(rows[0]);
        } catch (error) {
            console.error("Erro ao criar reserva:", error);
            return null;
        }
    }

    async remover(id: number) {
        return this.repo.remover(id)
    }
    async atualizar(id: number, dadosAtualizados: {
        novadataReserva: string; novadataVolta: string; novapago: boolean; novaemailUsuario: string; novaemailGuia: string; novavalor: number;
    }): Promise<Reserva> {

        const reservaExistente = await this.repo.buscarPorId(id)

        if (!reservaExistente) {
            throw new Error("Reserva inexistente")
        }

        const novapago = dadosAtualizados.novapago ? 'true' : 'false'

        const reservaParaAtualizar = new Reserva(
            id,
            dadosAtualizados.novadataReserva || reservaExistente.getDataReserva(),
            dadosAtualizados.novadataVolta || reservaExistente.getDataVolta(),
            novapago,
            dadosAtualizados.novaemailUsuario || reservaExistente.getEmailUsuario(),
            dadosAtualizados.novaemailGuia || reservaExistente.getEmailGuia(),
            Number(dadosAtualizados.novavalor) || reservaExistente.getValor()
        );

        return this.repo.atualizar(id, reservaParaAtualizar)
    }
}
