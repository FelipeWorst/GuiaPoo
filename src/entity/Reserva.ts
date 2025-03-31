export class Reserva {
    public idReserva: number
    public emailGuia: string
    public emailUsuario: string
    public dataReserva: string
    public dataVolta: string
    public valor: number
    public pago: boolean | string

    constructor(idReserva: number, dataReserva: string, dataVolta: string, pago: boolean | string, emailUsuario: string, emailGuia: string, valor: number) {
        this.idReserva = idReserva
        this.emailGuia = emailGuia
        this.emailUsuario = emailUsuario
        this.dataReserva = dataReserva
        this.dataVolta = dataVolta
        this.valor = valor
        this.pago = pago
    } 

    getIdReserva(): number {
        return this.idReserva
    }
    getEmailGuia(): string {
        return this.emailGuia
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