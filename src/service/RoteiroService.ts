import { error } from "console"
import { Roteiro } from "../entity/Roteiro"
import { RoteiroRepository } from "../repository/RoteiroRepository"
import { Database } from "../repository/Database"
import { Pool } from "pg"

export class RoteiroService {

    private repo: RoteiroRepository
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
        this.repo = new RoteiroRepository()
    }
    mapear(row: any): Roteiro {
        return new Roteiro(row.id_roteiro, row.data_roteiro, row.data_volta, row.valor, row.descricao)
    }
    async listar(): Promise<Roteiro[]> {
        return await this.repo.listar()
    }

    async buscarPorId(id: number): Promise<Roteiro | string> {
        const Roteiro = await this.repo.buscarPorId(id)
        if (!Roteiro) {
            return "Usuário não encontrado."
        }
        return Roteiro
    }

    async criar(dados: Partial<Roteiro>): Promise<Roteiro | null> {
        const { id_roteiro, data_roteiro, data_volta, valor, descricao } = dados

        if (!id_roteiro || !data_roteiro || !data_volta || !valor || descricao === undefined) {
            throw new Error("Todos os campos são obrigatórios para criar um roteiro.")
        }
        const query = `INSERT INTO guia.roteiro (id_roteiro, data_roteiro, data_volta, valor, descricao) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const valores = [id_roteiro, data_roteiro, data_volta, valor, descricao]
    
        try {
            const { rows } = await this.pool.query(query, valores)
            return this.mapear(rows[0])
        } catch (error) {
            console.error("Erro ao criar roteiro:", error)
            return null
        }
    }

    async remover(id: number) {
        return this.repo.remover(id)
    }
    async atualizar(id: number, dadosAtualizados: { novaDataRoteiro?: string; novaDataVolta?: string; novoValor?: string; novaDescricao?: string
        }
    ): Promise<Roteiro> {
        const RoteiroExistente = await this.repo.buscarPorId(id)
        
        if (!RoteiroExistente) {
            throw new Error("Roteiro inexistente")
        }
        const RoteiroParaAtualizar = new Roteiro(id,
            dadosAtualizados.novaDataRoteiro || RoteiroExistente.getDataRoteiro(),
            dadosAtualizados.novaDataVolta || RoteiroExistente.getDataVolta(),
            dadosAtualizados.novoValor || RoteiroExistente.getValor(),
            dadosAtualizados.novaDescricao || RoteiroExistente.getDescricao()
        )
    
        return this.repo.atualizar(id, RoteiroParaAtualizar)
    }
}
