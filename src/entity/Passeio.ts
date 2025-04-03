export class Passeio {
    public idPasseio: number
    public dataPasseio: string   
    public valor: string
    public descricao: string
    public emailGuia: string

    constructor(idPasseio: number, dataPasseio: string, valor: string, descricao: string, emailGuia: string) {
        this.idPasseio = idPasseio
        this.dataPasseio = dataPasseio
        this.valor = valor
        this.descricao = descricao
        this.emailGuia = emailGuia
    }

    public getIdPasseio(): number {
        return this.idPasseio
    }

    public getDataPasseio(): string {
        return this.dataPasseio
    }

    public getValor(): string {
        return this.valor
    }

    public getDescricao(): string {
        return this.descricao
    }

    public getEmailGuia(): string {
        return this.emailGuia
    }

    static mostrarDados(): void {

    }

    static inserirPasseio(): void {

    }

    static deletarPasseio(): void {

    }

    static encontrarPasseio(): void {

    }

    static editarPasseio(): void {

    }
}