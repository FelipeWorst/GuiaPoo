import { error } from "console"
import { Passeio } from "../entity/Passeio"
import { PasseioRepository } from "../repository/PasseioRepository"
import { Database } from "../repository/Database"
import { Pool } from "pg"

export class PasseioService {

    private repo: PasseioRepository
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
        this.repo = new PasseioRepository()
    }
    mapear(row: any): Passeio {
        return new Passeio(row.id_passeio, row.data_passeio, row.valor, row.descricao, row.email_guia)
    }
    async listar(): Promise<Passeio[]> {
        return await this.repo.listar()
    }

    async buscarPorId(id: number): Promise<Passeio | string> {
        const Passeio = await this.repo.buscarPorId(id)
        if (!Passeio) {
            return "passeio não encontrado."
        }
        return Passeio
    }

    async criar(dados: Partial<Passeio>): Promise<Passeio | null> {
        const { idPasseio, descricao, emailGuia, valor, dataPasseio } = dados

        if (!idPasseio || !descricao || !emailGuia || !valor || dataPasseio === undefined) {
            throw new Error("Todos os campos são obrigatórios para criar um usuário.")
        }
        const query = `INSERT INTO guia.Passeio (id_passeio, descricao, email_guia, valor, data_passeio) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const valores = [idPasseio, descricao, emailGuia, valor, dataPasseio]
    
        try {
            const { rows } = await this.pool.query(query, valores)
            return this.mapear(rows[0])
        } catch (error) {
            console.error("Erro ao criar usuário:", error)
            return null
        }
    }

    async remover(id: number) {
        return this.repo.remover(id)
    }
    async atualizar(id: number, dadosAtualizados: { novaDescricao: string; novoEmail?: string; novoValor?: string; novaData?: string }): Promise<Passeio> {
        const PasseioExistente = await this.repo.buscarPorId(id)
        
        if (!PasseioExistente) {
            throw new Error("Passeio inexistente")
        }
    
        const PasseioParaAtualizar = new Passeio(
            id, 
            dadosAtualizados.novaData || PasseioExistente.getDataPasseio(),
            dadosAtualizados.novoValor || PasseioExistente.getValor(),
            dadosAtualizados.novaDescricao || PasseioExistente.getDescricao(),
            dadosAtualizados.novoEmail || PasseioExistente.getEmailGuia()
        );
    
        return this.repo.atualizar(id, PasseioParaAtualizar)
    }
}
