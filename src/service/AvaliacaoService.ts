import { error } from "console"
import { Avaliacao } from "../entity/Avaliacao"
import { AvaliacaoRepository } from "../repository/AvaliacaoRepository"
import { Database } from "../repository/Database"
import { Pool } from "pg"

export class AvaliacaoService {

    private repo: AvaliacaoRepository
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
        this.repo = new AvaliacaoRepository()
    }
    mapear(row: any): Avaliacao {
        return new Avaliacao(row.idAvaliacao, row.nota, row.comentario, row.data_avaliacao, row.id_passeio_avaliado)
    }
    async listar(): Promise<Avaliacao[]> {
        return await this.repo.listar()
    }

    async buscarPorId(id: number): Promise<Avaliacao | string> {
        const Avaliacao = await this.repo.buscarPorId(id)
        if (!Avaliacao) {
            return "avaliacao não encontrado."
        }
        return Avaliacao
    }

    async criar(dados: Partial<Avaliacao>): Promise<Avaliacao | null> {
        const { id_avaliacao, nota, comentario, data_avaliacao, id_passeio_avaliado } = dados

        if (!id_avaliacao || !nota || !comentario || !data_avaliacao || !id_passeio_avaliado) {
            throw new Error("Todos os campos são obrigatórios para criar um usuário.")
        }
        const query = `INSERT INTO guia.avaliacoes( id_avaliacao, nota, comentario, data_avaliacao, id_passeio_avaliado ) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const valores = [id_avaliacao, nota, comentario, data_avaliacao, id_passeio_avaliado]

        try {
            const { rows } = await this.pool.query(query, valores)
            return this.mapear(rows[0])
        } catch (error) {
            console.error("Erro ao criar avaliacao:", error)
            return null
        }
    }

    async remover(id: number) {
        return this.repo.remover(id)
    }
    async atualizar(id: number, dadosAtualizados: Avaliacao): Promise<Avaliacao> {
        const avaliacaoExistente = await this.repo.buscarPorId(id)
        if (!avaliacaoExistente) {
            throw new Error("[ERRO] Avaliação não encontrada para atualização.")
        }

        if (
            !dadosAtualizados.getNota() &&
            !dadosAtualizados.getComentario() &&
            !dadosAtualizados.getDataAvaliacao() &&
            !dadosAtualizados.getIdPasseio()
        ) {
            return avaliacaoExistente
        }
        const notaAtualizada = dadosAtualizados.getNota()
        if (notaAtualizada !== undefined && (notaAtualizada < 1 || notaAtualizada > 10)) {
            throw new Error("[ERRO] A nota deve estar entre 1 e 10.")
        }
        return this.repo.atualizar(id, dadosAtualizados)
    }
}

