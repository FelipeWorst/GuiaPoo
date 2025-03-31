import { Pool } from "pg"
import { Database } from "./Database"
import { Usuario } from "../entity/Usuario"
import { InterfaceRepository } from "./InterfaceRepository";

export class UsuarioRepository implements InterfaceRepository<Usuario> {
    private pool: Pool;
    private usuarios: { nome: string; email: string; senha: string; tipo: "guia" | "usuario"; id_usuario: number }[]

    constructor() {
        this.pool = Database.iniciarConexao()
        this.usuarios = []
    }
    public mapear(row: any): Usuario {
        return new Usuario(row.nome, row.email, row.senha, row.tipo, row.id_usuario)
    }

    async listar(): Promise<Usuario[]> {
        const query = "select * from guia.Usuario"
        const result = await this.pool.query(query)
        const listarUsuarios: Usuario[] = []

        for (const row of result.rows) {
            const usuario = new Usuario(row.nome, row.email, row.senha, row.tipo, row.id_usuario)
            listarUsuarios.push(usuario)
        }
        return listarUsuarios;
    }

    async buscarPorId(id: number): Promise<Usuario | null> {
        const query = "SELECT * from guia.usuario where id_usuario = $1"
        const result = await this.pool.query(query, [id])
        if (result.rowCount === 0) {
            return null
        }
        const row = result.rows[0]
        return new Usuario(row.nome, row.email, row.senha, row.tipo, row.id_usuario)
    }
    async inserir(dados: Usuario): Promise<Usuario> {
        const { nome, email, senha, tipo, id_usuario } = dados
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!emailRegex.test(email)) {
            throw new Error("E-mail inválido. Insira um e-mail válido.")
        }
    
        const usuarioExistente = await this.buscarPorId(id_usuario)
        if (usuarioExistente) {
            throw new Error("Não é possível criar o usuário. O ID já está sendo utilizado.")
        }
    
        const query = `INSERT INTO guia.usuario(nome, email, senha, tipo, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const valores = [nome, email, senha, tipo, id_usuario];
    
        try {
            const { rows } = await this.pool.query(query, valores)
            
            return new Usuario(rows[0].nome, rows[0].email, rows[0].senha, rows[0].tipo, rows[0].id_usuario)
        } catch (error) {
            throw new Error("Erro ao inserir usuário no banco de dados.")
        }
    }

    async remover(id: number): Promise<string> {
        try {
            const query = "DELETE FROM guia.usuario WHERE id_usuario = $1"
            await this.pool.query(query, [id])
            return "Usuário removido com sucesso"
        }
        catch (error) {
            console.error("Erro ", error)
            throw new Error("Usuario nao existente")
        }
    }

    async atualizar(id: number, entidade: Usuario): Promise<Usuario> {
        try {
            const campos: string[] = []
            
            const valores: any[] = []
            let index = 1

            if (entidade.nome && entidade.nome !== "") {
                campos.push("nome = $" + index)
                valores.push(entidade.nome)
                index++
            }
    
            if (entidade.email && entidade.email !== "") {
                campos.push("email = $" + index)
                valores.push(entidade.email)
                index++
            } 
    
            if (entidade.senha && entidade.senha !== "") {
                campos.push("senha = $" + index)
                valores.push(entidade.senha)
                index++
            }
    
            if (entidade.tipo && (entidade.tipo === "guia" || entidade.tipo === "usuario")) {
                campos.push("tipo = $" + index)
                valores.push(entidade.tipo)
                index++
            }
    
            if (campos.length === 0) {
                throw new Error("Nenhum campo foi atualizado.")
            }
    
            const query = `UPDATE guia.Usuario SET ${campos.join(", ")} WHERE id_usuario = $${index} RETURNING *`
            valores.push(id)
    
            const result = await this.pool.query(query, valores)
    
            if (result.rowCount === 0) {
                throw new Error("Usuário não encontrado.")
            }
            return new Usuario(result.rows[0].nome, result.rows[0].email, result.rows[0].senha, result.rows[0].tipo, result.rows[0].id_usuario)
    
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error)
            throw new Error("Falha ao atualizar usuário.")
        }
    }
}
