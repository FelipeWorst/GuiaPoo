import { Pool } from "pg"
import { Database } from "./Database"
import { InterfaceRepository } from "./InterfaceRepository"
import { Avaliacao } from "../entity/Avaliacao"

export class AvaliacaoRepository implements InterfaceRepository<Avaliacao> {
    private pool: Pool

    constructor() {
        this.pool = Database.iniciarConexao()
    }

    mapear(row: any): Avaliacao {
        return new Avaliacao(row.id_avaliacao, row.nota, row.comentario, row.data_avaliacao)
    }

    async listar(): Promise<Avaliacao[]> {
        const query = `SELECT id_avaliacao, nota, comentario, data_avaliacao FROM guia.avaliacoes`

        try {
            const { rows } = await this.pool.query(query)
            return rows.map(this.mapear)
        } catch (error) {
            console.error("Erro ao listar avaliações:", error)
            return []
        }
    }

    async buscarPorId(id: number): Promise<Avaliacao | null> {
        const query = "SELECT * FROM guia.avaliacoes WHERE id_avaliacao = $1"
        const result = await this.pool.query(query, [id])
        return result && result.rowCount && result.rowCount > 0 ? this.mapear(result.rows[0]) : null
    }

    async inserir(dados: Avaliacao): Promise<Avaliacao> {
        const { id_avaliacao, nota, comentario, data_avaliacao } = dados

        const query = `
            INSERT INTO guia.avaliacoes (id_avaliacao, nota, comentario, data_avaliacao) VALUES ($1, $2, $3, $4) RETURNING *`

        const valores = [id_avaliacao, nota, comentario, data_avaliacao]

        const { rows } = await this.pool.query(query, valores)
        return this.mapear(rows[0])
    }

    async remover(id: number): Promise<string> {
        const query = "DELETE FROM guia.avaliacoes WHERE id_avaliacao = $1"
        await this.pool.query(query, [id])
        return "Avaliação removida com sucesso"
    }

    async atualizar(id: number, entidade: Avaliacao): Promise<Avaliacao> {
        try {
            const campos: string[] = []
            const valores: any[] = []
            let index = 1

            if (entidade.getNota() !== undefined) {
                campos.push("nota = $" + index)
                valores.push(entidade.getNota())
                index++
            }

            if (entidade.getComentario()) {
                campos.push("comentario = $" + index)
                valores.push(entidade.getComentario())
                index++
            }

            if (entidade.getDataAvaliacao()) {
                campos.push("data_avaliacao = $" + index)
                valores.push(entidade.getDataAvaliacao())
                index++
            }

            const query = "UPDATE guia.avaliacoes SET " + campos.join(", ") + " WHERE id_avaliacao = $" + (valores.length + 1) + " RETURNING *"
            valores.push(id)

            const result = await this.pool.query(query, valores)
            return this.mapear(result.rows[0])
        } catch (error) {
            console.error("Erro ", error)
            throw new Error("Falha")
        }
    }
}
