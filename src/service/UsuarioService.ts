import { error } from "console"
import { Usuario } from "../entity/Usuario"
import { UsuarioRepository } from "../repository/UsuarioRepository"
import { Database } from "../repository/Database"
import { Pool } from "pg"

export class UsuarioService {

    private repo: UsuarioRepository
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
        this.repo = new UsuarioRepository()
    }
    mapear(row: any): Usuario {
        return new Usuario(row.nome, row.email, row.senha, row.tipo, row.id_usuario)
    }
    async listar(): Promise<Usuario[]> {
        return await this.repo.listar()
    }

    async buscarPorId(id: number): Promise<Usuario | string> {
        const usuario = await this.repo.buscarPorId(id)
        if (!usuario) {
            return "Usuário não encontrado."
        }
        return usuario
    }

    async criar(dados: Partial<Usuario>): Promise<Usuario | null> {
        const { nome, email, senha, tipo, id_usuario } = dados

        if (!nome || !email || !senha || !tipo || id_usuario === undefined) {
            throw new Error("Todos os campos são obrigatórios para criar um usuário.")
        }
        const query = `INSERT INTO guia.usuario (nome, email, senha, tipo, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const valores = [nome, email, senha, tipo, id_usuario]
    
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
    async atualizar(id: number, dadosAtualizados: { novoNome: string; novaSenha?: string; novoTipo?: string; email?: string }): Promise<Usuario> {
        const usuarioExistente = await this.repo.buscarPorId(id)
        
        if (!usuarioExistente) {
            throw new Error("Usuario inexistente")
        }
    
        if (dadosAtualizados.novoTipo && dadosAtualizados.novoTipo !== "guia" && dadosAtualizados.novoTipo !== "usuario") {
            throw new Error("Tipo inválido. O tipo deve ser 'guia' ou 'usuario'.")
        }
    
        const usuarioParaAtualizar = new Usuario(
            dadosAtualizados.novoNome || usuarioExistente.getNome(),
            dadosAtualizados.email || usuarioExistente.getEmail(),
            dadosAtualizados.novaSenha || usuarioExistente.getSenha(),
            dadosAtualizados.novoTipo ? (dadosAtualizados.novoTipo as "guia" | "usuario") : usuarioExistente.getTipo(),
            id
        );
    
        return this.repo.atualizar(id, usuarioParaAtualizar) 
    }
}
