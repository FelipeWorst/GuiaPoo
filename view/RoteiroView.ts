import promptSync from "prompt-sync"
import { RoteiroService } from "../src/service/RoteiroService"

export class RoteiroView {
    private RoteiroService: RoteiroService
    private prompt: promptSync.Prompt

    constructor() {
        this.RoteiroService = new RoteiroService()
        this.prompt = promptSync()
    }

    async exibirMenu(): Promise<void> {
        while (true) {
            console.log("\n===== MENU =====")
            console.log("[1] Exibir roteiro")
            console.log("[2] Buscar roteiro")
            console.log("[3] Inserir roteiro")
            console.log("[4] Deletar roteiro")
            console.log("[5] Editar Roteiro")
            console.log("[0] Sair")
            const escolha = this.prompt("Escolha uma opção: ")

            switch (escolha) {
                case "1":
                    console.table(await this.RoteiroService.listar())
                    break
                case "2":
                    console.table(await this.RoteiroService.listar())
                    const idBusca = parseInt(this.prompt("Digite o id do Roteiro: "), 10)
                    console.log(await this.RoteiroService.buscarPorId(idBusca))
                    break
                case "3":
                    const id_roteiro = parseInt(this.prompt("Digite o id do Roteiro: "), 10)
                    const data_roteiro = this.prompt("Digite a data do Roteiro: ")
                    const data_volta = this.prompt("Digite a data de volta do Roteiro: ")
                    const valor = this.prompt("Digite o valor do Roteiro: ");
                    const descricao = this.prompt("Digite a descrição do Roteiro: ")

                    await this.RoteiroService.criar({ id_roteiro, data_roteiro, data_volta, valor, descricao })
                    break
                case "4":
                    console.table(await this.RoteiroService.listar())
                    const idDeletar = parseInt(this.prompt("Digite o id do Roteiro: "), 10)
                    await this.RoteiroService.remover(idDeletar)
                    break
                case "5":
                    console.table(await this.RoteiroService.listar())
                    let dadosAtualizados: any = {}
                    const idAtualizar = parseInt(this.prompt("Digite o ID do roteiro que deseja editar: "), 10)
                    const dataAtualizar = this.prompt("Nova data (deixe em branco para manter o atual): ")
                    const voltaAtualizar = this.prompt("Nova data volta (deixe em branco para manter o atual): ")
                    const valorAtualizar = this.prompt("Novo valor (deixe em branco para manter o atual): ")
                    const descricaoAtualizar = this.prompt("Nova descrição (deixe em branco para manter a atual): ")

                    if (dataAtualizar) dadosAtualizados.novaDataRoteiro = dataAtualizar
                    if (voltaAtualizar) dadosAtualizados.novaDataVolta = voltaAtualizar
                    if (valorAtualizar) dadosAtualizados.novoValor = valorAtualizar
                    if (descricaoAtualizar) dadosAtualizados.novaDescricao = descricaoAtualizar

                    const RoteiroAtualizado = await this.RoteiroService.atualizar(idAtualizar, dadosAtualizados)
                    console.table(RoteiroAtualizado)
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