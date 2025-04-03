import { Pool } from "pg"
import { Database } from "./Database"
import { Passeio } from "../entity/Passeio"
import { InterfaceRepository } from "./InterfaceRepository"

export class PasseioRepository implements InterfaceRepository<Passeio> {
    private pool: Pool

    constructor() {
        this.pool = Database.iniciarConexao()
    }

    public mapear(row: any): Passeio {
        return new Passeio(row.id_passeio, row.data_passeio, row.valor, row.descricao, row.email_guia)
    }

    async listar(): Promise<Passeio[]> {
        const query = "SELECT * FROM guia.passeio";
        const result = await this.pool.query(query)
        const listarPasseios: Passeio[] = []

        for (const row of result.rows) {
            listarPasseios.push(this.mapear(row))
        }

        return listarPasseios
    }

    async buscarPorId(id: number): Promise<Passeio | null> {
        const query = "SELECT * FROM guia.passeio WHERE id_passeio = $1"
        const result = await this.pool.query(query, [id])
        if (result.rowCount === 0) {
            return null
        }
        return this.mapear(result.rows[0])
    }

    async inserir(dados: Passeio): Promise<Passeio> {
        const { idPasseio, descricao, emailGuia, valor, dataPasseio } = dados;

        const passeioExistente = await this.buscarPorId(idPasseio)
        if (passeioExistente) {
            throw new Error("Não é possível criar o passeio. O ID já está sendo utilizado.")
        }

        const query = `INSERT INTO guia.passeio(id_passeio, descricao, email_guia, valor, data_passeio) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const valores = [idPasseio, descricao, emailGuia, valor, dataPasseio]

        try {
            const { rows } = await this.pool.query(query, valores)
            return this.mapear(rows[0])
        } catch (error) {
            throw new Error("Erro ao inserir passeio no banco de dados.")
        }
    }

    async remover(id: number): Promise<string> {
        try {
            const query = "DELETE FROM guia.passeio WHERE id_passeio = $1"
            await this.pool.query(query, [id])
            return "Passeio removido com sucesso"
        } catch (error) {
            console.error("Erro:", error)
            throw new Error("Passeio não existente")
        }
    }

    async atualizar(id: number, entidade: Passeio): Promise<Passeio> {
        try {
            const campos: string[] = []
            const valores: any[] = []
            let index = 1

            if (entidade.descricao && entidade.descricao !== "") {
                campos.push("descricao = $" + index)
                valores.push(entidade.descricao)
                index++
            }   

            if (entidade.emailGuia && entidade.emailGuia !== "") {
                campos.push("email_guia = $" + index)
                valores.push(entidade.emailGuia)
                index++
            }

            if (entidade.valor && entidade.valor !== undefined) {
                campos.push("valor = $" + index)
                valores.push(entidade.valor)
                index++
            }

            if (entidade.dataPasseio && entidade.dataPasseio !== "") {
                campos.push("data_passeio = $" + index)
                valores.push(entidade.dataPasseio)
                index++
            }

            if (campos.length === 0) {
                throw new Error("Nenhum campo foi atualizado.")
            }

            const query = `UPDATE guia.passeio SET ${campos.join(", ")} WHERE id_passeio = $${index} RETURNING *`
            valores.push(id)

            const result = await this.pool.query(query, valores)

            if (result.rowCount === 0) {
                throw new Error("Passeio não encontrado.")
            }

            return this.mapear(result.rows[0])
        } catch (error) {
            console.error("Erro ao atualizar passeio:", error)
            throw new Error("Falha ao atualizar passeio.")
        }
    }
}