import promptSync from "prompt-sync"
import { ReservaService } from "../src/service/ReservaService"
import { UsuarioService } from "../src/service/UsuarioService"
import { PasseioService } from "../src/service/PasseioService"

export class ReservaView {
    private reservaService: ReservaService
    private prompt: promptSync.Prompt
    private UsuarioService: UsuarioService
    private PasseioService: PasseioService
    constructor() {
        this.reservaService = new ReservaService()
        this.prompt = promptSync()
        this.UsuarioService = new UsuarioService()
        this.PasseioService = new PasseioService()
    }

    async exibirMenu(): Promise<void> {
        while (true) {
            console.log("\n===== MENU =====")
            console.log("[1] Exibir reservas")
            console.log("[2] Buscar reservas")
            console.log("[3] Inserir reservas")
            console.log("[4] Deletar reservas")
            console.log("[5] Editar reservas")
            console.log("[0] Sair")

            const escolha = this.prompt("Escolha uma opção: ");

            switch (escolha) {
                case "1":
                    console.table(await this.reservaService.listar())
                    break
                case "2":
                    console.table(await this.reservaService.listar())
                    const idBusca = parseInt(this.prompt("Digite o ID da Reserva: "), 10)
                    const reservaEncontrada = await this.reservaService.buscarPorId(idBusca)
                    console.table(reservaEncontrada)
                    break
                case "3":
                    const idReserva = parseInt(this.prompt("Digite o ID da Reserva: "), 10)
                    console.table(await this.UsuarioService.listar())
                    const emailUsuario = this.prompt("Digite o email do usuario da Reserva:: ")
                    const idPasseio = this.prompt("Digite o id do passeio da Reserva: ")
                    const dataReserva = this.prompt("Digite a data da Reserva (YYYY-MM-DD): ")
                    const dataVolta = this.prompt("Digite a data de volta da Reserva (YYYY-MM-DD): ")
                    const valor = parseFloat(this.prompt("Digite o valor da Reserva: "))
                    const pago = this.prompt("Está pago? (sim/nao): ").toLowerCase()

                    const novaReserva = { idReserva, idPasseio, emailUsuario, dataReserva, dataVolta, valor, pago }

                    await this.reservaService.criar(novaReserva)
                    console.log(" Reserva criada com sucesso!")
                    break
                case "4":
                    console.table(await this.reservaService.listar())
                    const idDeletar = parseInt(this.prompt("Digite o ID da Reserva para excluir: "), 10)
                    await this.reservaService.remover(idDeletar)
                    console.log(" Reserva excluída com sucesso!")
                    break
                case "5":
                    console.table(await this.reservaService.listar())
                    const idAtualizar = parseInt(this.prompt("Digite o ID da reserva que deseja editar: "), 10)
                    let dadosAtualizados: any = {}
                    console.table(await this.PasseioService.listar())
                    const novoIdPasseio = this.prompt("Novo id do passeio (deixe em branco para manter o atual): ")
                    console.table(await this.UsuarioService.listar())
                    const novoEmailUsuario = this.prompt("Novo email do usuário (deixe em branco para manter o atual): ")
                    const novaDataReserva = this.prompt("Nova data da reserva (YYYY-MM-DD) (deixe em branco para manter a atual): ")
                    const novaDataVolta = this.prompt("Nova data de volta (YYYY-MM-DD) (deixe em branco para manter a atual): ")
                    const novoValor = this.prompt("Novo valor da reserva (deixe em branco para manter o atual): ")
                    const novoPago = this.prompt("Está pago? (sim/nao) (deixe em branco para manter o atual): ")

                    if (novoIdPasseio) dadosAtualizados.emailGuia = novoIdPasseio
                    if (novoEmailUsuario) dadosAtualizados.emailUsuario = novoEmailUsuario
                    if (novaDataReserva) dadosAtualizados.dataReserva = novaDataReserva
                    if (novaDataVolta) dadosAtualizados.dataVolta = novaDataVolta
                    if (novoValor) dadosAtualizados.valor = parseFloat(novoValor)
                    if (novoPago) dadosAtualizados.pago = novoPago.toLowerCase()

                    console.log(" Atualizando reserva com ID:", idAtualizar, "com os dados:", dadosAtualizados)
                    const reservaAtualizada = await this.reservaService.atualizar(idAtualizar, dadosAtualizados)
                    console.log(" Reserva atualizada com sucesso!")
                    console.table(reservaAtualizada)
                    break;
                case "0":
                    console.log("Saindo...")
                    return;
                default:
                    console.log("Opção inválida. Tente novamente.")
            }
        }
    }
}