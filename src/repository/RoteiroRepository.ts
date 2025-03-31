import { Pool } from "pg"
import { Database } from "./Database"
import { Roteiro } from "../entity/Roteiro"
import { InterfaceRepository } from "./InterfaceRepository"

export class RoteiroRepository implements InterfaceRepository<Roteiro> {
    private pool: Pool;

    constructor() {
        this.pool = Database.iniciarConexao()
    }
    public mapear(row: any): Roteiro {
        return new Roteiro(row.id_roteiro, row.data_roteiro, row.data_volta, row.valor, row.descricao)
    }

    async listar(): Promise<Roteiro[]> {
        const query = "select * from guia.Roteiro"
        const result = await this.pool.query(query)
        const listarRoteiros: Roteiro[] = []
    
        for (const row of result.rows) {
            const roteiro = new Roteiro(row.id_roteiro, row.data_roteiro, row.data_volta, row.valor, row.descricao)
            listarRoteiros.push(roteiro)
        }
        return listarRoteiros
    }

    async buscarPorId(id: number): Promise<Roteiro | null> {
        const query = "SELECT * from guia.roteiro where id_Roteiro = $1"
        const result = await this.pool.query(query, [id])
        if (result.rowCount === 0) {
            return null
        }
        const row = result.rows[0]
        return new Roteiro(row.id_roteiro, row.data_roteiro, row.data_volta, row.valor, row.descricao)
    }
    async inserir(dados: Roteiro): Promise<Roteiro> {
        const { id_roteiro, data_roteiro, data_volta, valor, descricao } = dados
    
        const RoteiroExistente = await this.buscarPorId(id_roteiro)
        if (RoteiroExistente) {
            throw new Error("Não é possível criar o roteiro. O ID já está sendo utilizado.")
        }
    
        const query = `INSERT INTO guia.roteiro(id_roteiro, data_roteiro, data_volta, valor, descricao) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const valores = [id_roteiro, data_roteiro, data_volta, valor, descricao];
    
        try {
            const { rows } = await this.pool.query(query, valores)
            
            return new Roteiro(rows[0].id_roteiro, rows[0].data_roteiro, rows[0].data_volta, rows[0].valor, rows[0].descricao)
        } catch (error) {
            throw new Error("Erro ao inserir roteiro no banco de dados.")
        }
    }

    async remover(id: number): Promise<string> {
        try {
            const query = "DELETE FROM guia.roteiro WHERE id_roteiro = $1"
            await this.pool.query(query, [id])
            return "Roteiro removido com sucesso"
        }
        catch (error) {
            console.error("Erro ", error)
            throw new Error("Roteiro nao existente")
        }
    }

    async atualizar(id: number, entidade: Roteiro): Promise<Roteiro> {
        try {
            const campos: string[] = []
            const valores: any[] = []
            let index = 1

            if (entidade.data_roteiro && entidade.data_roteiro !== "") {
                campos.push("data_roteiro = $" + index)
                valores.push(entidade.data_roteiro)
                index++
            }
    
            if (entidade.data_volta && entidade.data_volta !== "") {
                campos.push("data_volta = $" + index)
                valores.push(entidade.data_volta)
                index++
            }
    
            if (entidade.valor && entidade.valor !== "") {
                campos.push("valor = $" + index)
                valores.push(entidade.valor)
                index++
            }
    
            if (entidade.descricao &&  entidade.descricao !== "") {
                campos.push("descricao = $" + index)
                valores.push(entidade.descricao)
                index++
            }
    
            if (campos.length === 0) {
                throw new Error("Nenhum campo foi atualizado.")
            }
    
            const query = `UPDATE guia.roteiro SET ${campos.join(", ")} WHERE id_roteiro = $${index} RETURNING *`
            valores.push(id)
    
            const result = await this.pool.query(query, valores)
    
            if (result.rowCount === 0) {
                throw new Error("roteiro não encontrado.")
            }
            return new Roteiro(result.rows[0].id_roteiro, result.rows[0].data_roteiro, result.rows[0].data_volta, result.rows[0].valor, result.rows[0].descricao)
        } catch (error) {
            console.error("Erro ao atualizar roteiro:", error)
            throw new Error("Falha ao atualizar roteiro.")
        }
    }
}
