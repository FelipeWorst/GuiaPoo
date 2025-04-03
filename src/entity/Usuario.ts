export class Usuario {
    public nome: string
    public email: string
    public senha: string
    public tipo: "guia" | "usuario"
    public id_usuario: number

    static usuarios: Usuario[] = []

    constructor(nome: string, email: string, senha: string, tipo: "guia" | "usuario", id_usuario: number) {
        this.nome = nome
        this.email = email
        this.senha = senha
        this.tipo = tipo
        this.id_usuario = id_usuario
    }

    getNome(): string {
        return this.nome
    }
    getEmail(): string {
        return this.email
    }
    getSenha(): string {
        return this.senha
    }
    getTipo(): "guia" | "usuario" {
        return this.tipo
    }
    getIdUsuario(): number { 
        return this.id_usuario
    }


    static inserirUsuario(usuario: Usuario): void {
        this.usuarios.push(usuario)
    }

    static deletarUsuario(email: string): void {
        const index = this.usuarios.findIndex(user => user.email === email)
    
        if (index !== -1) {
            this.usuarios.splice(index, 1)
            console.log("Usuário deletado com sucesso.")
        } else {
            console.log("Usuário não encontrado!")
        }
    }

    static encontrarUsuario(email: string): string {
        const usuario = this.usuarios.find(user => user.email === email)
        return usuario ? `Usuario: ${usuario.getNome()} encontrado!` : "Usuario nao encontrado!"
    }

    static editarUsuario(email: string, novoNome?: string, novaSenha?: string, novoTipo?: "guia" | "usuario", novoid_usuario?: number): void {
        const usuario = this.usuarios.find(user => user.email === email)

        if (usuario) {
            if (novoNome) usuario.nome = novoNome
            if (novaSenha) usuario.senha = novaSenha
            if (novoTipo) usuario.tipo = novoTipo
            if (novoid_usuario !== undefined) usuario.id_usuario = novoid_usuario
            console.log("Usuário atualizado com sucesso.")
        } else {
            console.log("Usuário não encontrado!")
        }
    }

    static mostrarDados(): void {
        for (let i = 0; i < this.usuarios.length; i++) {
            console.log("Nome: " + this.usuarios[i].getNome())
            console.log("Email: " + this.usuarios[i].getEmail())
            console.log("Tipo: " + this.usuarios[i].getTipo())
            console.log("ID: " + this.usuarios[i].getIdUsuario())
            console.log("----------------------")
        }
    }
}