import promptSync from "prompt-sync"
import { PasseioService } from "../src/service/PasseioService"

export class PasseioView {
    private PasseioService: PasseioService
    private prompt: promptSync.Prompt

    constructor() {
        this.PasseioService = new PasseioService()
        this.prompt = promptSync()
    }

    async exibirMenu(): Promise<void> {
        while (true) {
            console.log("\n===== MENU =====")
            console.log("[1] Exibir Passeio")
            console.log("[2] Buscar Passeio")
            console.log("[3] Inserir Passeio")
            console.log("[4] Deletar Passeio")
            console.log("[5] Editar Passeio")
            console.log("[0] Sair")
            const escolha = this.prompt("Escolha uma opção: ")

            switch (escolha) {
                case "1":
                    console.table(await this.PasseioService.listar())
                    break
                case "2":
                    console.table(await this.PasseioService.listar())
                    const idBusca = parseInt(this.prompt("Digite o id do Passeio: "), 10)
                    console.log(await this.PasseioService.buscarPorId(idBusca))
                    break
                case "3":
                    const idPasseio = parseInt(this.prompt("Digite o id do Passeio: "), 10)
                    const dataPasseio = this.prompt("Digite a data do Passeio: ")
                    const emailGuia = this.prompt("Digite o email do guia do Passeio: ")
                    const valor = this.prompt("Digite o valor do Passeio: ");
                    const descricao = this.prompt("Digite a descrição do Passeio: ")

                    await this.PasseioService.criar({ idPasseio, descricao, emailGuia, valor, dataPasseio })
                    break
                case "4":
                    console.table(await this.PasseioService.listar())
                    const idDeletar = parseInt(this.prompt("Digite o id do Passeio: "), 10)
                    await this.PasseioService.remover(idDeletar)
                    break
                case "5":
                    console.table(await this.PasseioService.listar())
                    let dadosAtualizados: any = {}
                    const idAtualizar = parseInt(this.prompt("Digite o ID do Passeio que deseja editar: "), 10)
                    const dataAtualizar = this.prompt("Nova data (deixe em branco para manter o atual): ")
                    const emailAtualizar = this.prompt("Novo email (deixe em branco para manter o atual): ")
                    const valorAtualizar = this.prompt("Novo valor (deixe em branco para manter o atual): ")
                    const descricaoAtualizar = this.prompt("Nova descrição (deixe em branco para manter a atual): ")

                    if (dataAtualizar) dadosAtualizados.novaDataPasseio = dataAtualizar
                    if (emailAtualizar) dadosAtualizados.novaDataVolta = emailAtualizar
                    if (valorAtualizar) dadosAtualizados.novoValor = valorAtualizar
                    if (descricaoAtualizar) dadosAtualizados.novaDescricao = descricaoAtualizar

                    const PasseioAtualizado = await this.PasseioService.atualizar(idAtualizar, dadosAtualizados)
                    console.table(PasseioAtualizado)
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