import promptSync from "prompt-sync"
import { UsuarioService } from "../src/service/UsuarioService"


export class UsuarioView {
    private usuarioService: UsuarioService
    private prompt: promptSync.Prompt

    constructor() {
        this.usuarioService = new UsuarioService()
        this.prompt = promptSync()
    }

    async exibirMenu(): Promise<void> {
        while (true) {
            console.log("\n===== MENU =====")
            console.log("[1] Exibir usuários")
            console.log("[2] Buscar usuário")
            console.log("[3] Inserir usuário")
            console.log("[4] Deletar usuário") 
            console.log("[5] Editar usuario")
            console.log("[0] Sair")

            const escolha = this.prompt("Escolha uma opção: ")

            switch (escolha) {
                case "1":
                    console.table(await this.usuarioService.listar())
                    break
                case "2":
                    console.table(await this.usuarioService.listar())
                    const idBusca = this.prompt("Digite o id do usuario: ")
                    console.log(await this.usuarioService.buscarPorId(idBusca))
                    break
                case "3":
                    const nome = this.prompt("Digite o nome do Usuario: ")
                    const email = this.prompt("Digite o email do usuario: ")
                    const senha = this.prompt("Digite a senha do usuario: ")
                    const tipo = this.prompt("Digite o tipo do usuario: ")
                    const id_usuario = parseInt(this.prompt("Digite o id do usuario: "), 10)
                    
                    await this.usuarioService.criar({ nome, email, senha, tipo, id_usuario })
                    break
                case "4":
                    console.table(await this.usuarioService.listar())
                    const idDeletar = this.prompt("Digite o id do usuario: ")
                    await this.usuarioService.remover(idDeletar)
                    break
                case "5":
                    console.table(await this.usuarioService.listar())
                    let dadosAtualizados: any = {}
                    const idAtualizar = this.prompt("Digite o ID do usuário que deseja editar")
                    const nomeAtualizar = this.prompt("Novo nome (deixe em branco para manter o atual): ")
                    const emailAtualizar = this.prompt("Novo e-mail (deixe em branco para manter o atual): ")
                    const senhaAtualizar = this.prompt("Nova senha (deixe em branco para manter a atual): ")
                    const tipoAtualizar = this.prompt("Novo tipo (deixe em branco para manter a atual): ")

                    if (nomeAtualizar) dadosAtualizados.novoNome = nomeAtualizar
                    if (emailAtualizar) dadosAtualizados.email = emailAtualizar
                    if (senhaAtualizar) dadosAtualizados.novaSenha = senhaAtualizar
                    if (tipoAtualizar) dadosAtualizados.novoTipo = tipoAtualizar

                    const usuarioAtualizado = await this.usuarioService.atualizar(idAtualizar, dadosAtualizados)
                    console.table(usuarioAtualizado)
                    break
                case "0":
                    console.log("Saindo...")
                    return
                default:
                    console.log("Opção inválida. Tente novamente.")
            }
        }
    }
}