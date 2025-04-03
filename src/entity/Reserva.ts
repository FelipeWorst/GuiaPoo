export class Reserva {
    public idReserva: number
    public idPasseio: number
    public emailUsuario: string
    public dataReserva: string
    public dataVolta: string
    public valor: number
    public pago: boolean | string

    constructor(idReserva: number, dataReserva: string, dataVolta: string, pago: boolean , emailUsuario: string, idPasseio: number, valor: number) {
        this.idReserva = idReserva
        this.idPasseio = idPasseio
        this.emailUsuario = emailUsuario
        this.dataReserva = dataReserva
        this.dataVolta = dataVolta
        this.valor = valor
        this.pago = pago
        console.log("construtor 1", idPasseio)
    } 

    getIdReserva(): number {
        return this.idReserva
    }
    getIdPasseio(): number {
        return this.idPasseio
    }
    getEmailUsuario(): string {
        return this.emailUsuario
    }
    getDataReserva(): string {
        return this.dataReserva
    }
    getDataVolta(): string {
        return this.dataVolta
    }
    getValor(): number {
        return this.valor
    }
    getPago(): boolean | string {
        return this.pago
    }
}