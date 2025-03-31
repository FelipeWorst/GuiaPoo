import promptSync from "prompt-sync"
import { AvaliacaoService } from "../src/service/AvaliacaoService"
import { Avaliacao } from "../src/entity/Avaliacao"
import { PasseioService } from "../src/service/PasseioService"

export class AvaliacaoView {
    private AvaliacaoService: AvaliacaoService
    private prompt: promptSync.Prompt
    private PasseioService: PasseioService

    constructor() {
        this.AvaliacaoService = new AvaliacaoService()
        this.prompt = promptSync()
        this.PasseioService = new PasseioService()
    }

    async exibirMenu(): Promise<void> {
        while (true) {
            console.log("\n===== MENU =====")
            console.log("[1] Exibir avaliações")
            console.log("[2] Buscar avaliações")
            console.log("[3] Inserir avaliações")
            console.log("[4] Deletar avaliações")
            console.log("[5] Editar avaliações")
            console.log("[0] Sair")

            const escolha = this.prompt("Escolha uma opção: ")

            switch (escolha) {
                case "1":
                    console.table(await this.AvaliacaoService.listar())
                    break
                case "2":
                    console.table(await this.AvaliacaoService.listar())
                    const idBusca = this.prompt("Digite o id do Avaliacao: ")
                    console.log(await this.AvaliacaoService.buscarPorId(idBusca))
                    break
                case "3":
                    console.table(await this.PasseioService.listar())
                    const id_avaliacao = this.prompt("Digite o id do passeio a ser avaliado: ")
                    const nota = this.prompt("Digite a nota da Avaliacao: ")
                    const comentario = this.prompt("Digite o comentario da Avaliacao: ")
                    const data_avaliacao = this.prompt("Digite a data da Avaliacao: ")
                    await this.AvaliacaoService.criar({ id_avaliacao, nota, comentario, data_avaliacao })
                    break
                case "4":
                    console.table(await this.AvaliacaoService.listar())
                    const idDeletar = this.prompt("Digite o id do Avaliacao: ")
                    await this.AvaliacaoService.remover(idDeletar)
                    break
                case "5":
                    console.table(await this.AvaliacaoService.listar())
                    const idInput = this.prompt("Digite o ID da avaliação que deseja atualizar: ").trim()
                    if (!idInput || isNaN(Number(idInput))) {''
                        console.log("[ERRO] ID inválido!")
                        break
                    }

                    const idAtualizar = Number(idInput)
                    const novosDados = new Avaliacao()
                    const novaNota = this.prompt("Nova nota (deixe em branco para manter a atual): ").trim()
                    if (novaNota && !isNaN(Number(novaNota))) novosDados.setNota(Number(novaNota))

                    const novoComentario = this.prompt("Novo comentário (deixe em branco para manter o atual): ").trim()
                    if (novoComentario) novosDados.setComentario(novoComentario)

                    const novaDataAvaliacao = this.prompt("Nova data de avaliação (YYYY-MM-DD) (deixe em branco para manter a atual): ").trim()
                    if (novaDataAvaliacao) novosDados.setDataAvaliacao(novaDataAvaliacao)

                    console.table(await this.AvaliacaoService.atualizar(idAtualizar, novosDados))
                    break;
                case "0":
                    console.log("Saindo...")
                    return
                default:
                    console.log("Opção inválida. Tente novamente.")
            }
        }
    }
}