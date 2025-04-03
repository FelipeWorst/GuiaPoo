import { AvaliacaoView } from "./AvaliacaoView"
import { PasseioView } from "./PasseioView"
import { ReservaView } from "./ReservaView"
import { UsuarioView } from "./UsuarioView"
import promptSync from "prompt-sync"

export class MainView {
    private prompt: promptSync.Prompt
    private AvaliacaoView: AvaliacaoView
    private PasseioView: PasseioView
    private ReservaView: ReservaView
    private usuarioView: UsuarioView

    constructor() {
        this.prompt = new promptSync()
        this.AvaliacaoView = new AvaliacaoView()
        this.PasseioView = new PasseioView()
        this.ReservaView = new ReservaView()
        this.usuarioView = new UsuarioView()
    }

    async exibirMenu(): Promise<void> {
        let rodando = true
        while (rodando) {
            console.log("MENU PRINCIPAL")
            console.log("[1] Gerenciar Usuários")
            console.log("[2] Gerenciar Passeios")
            console.log("[3] Gerenciar Reservas")
            console.log("[4] Gerenciar Avaliações")
            console.log("[0] Sair")

            let opcao = this.prompt("Escolha uma opção: ")

            switch (opcao) {
                case "1":
                    await this.usuarioView.exibirMenu()
                    break

                case "2":
                    await this.PasseioView.exibirMenu()
                    break

                case "3":
                    await this.ReservaView.exibirMenu()
                    break

                case "4":
                    await this.AvaliacaoView.exibirMenu()
                    break

                case "0":
                    console.log("Saindo...")
                    rodando = false
                    break

                default:
                    console.log("[ERRO] Opção inválida")
            }
        }
    }
}