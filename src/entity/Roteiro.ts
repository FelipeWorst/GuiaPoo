export class Roteiro {
    public id_roteiro: number
    public data_roteiro: string
    public data_volta: string
    public valor: string
    public descricao: string

    constructor(id_roteiro: number, data_roteiro: string, data_volta: string, valor: string, descricao: string) {
        this.id_roteiro = id_roteiro
        this.data_roteiro = data_roteiro
        this.data_volta = data_volta
        this.valor = valor
        this.descricao = descricao
    }

    public getIdRoteiro(): number {
        return this.id_roteiro
    }

    public getDataRoteiro(): string {
        return this.data_roteiro
    }

    public getDataVolta(): string {
        return this.data_volta
    }

    public getValor(): string {
        return this.valor
    }

    public getDescricao(): string {
        return this.descricao
    }

    static mostrarDados(): void {}

    static inserirRoteiro(): void {}

    static deletarRoteiro(): void {}

    static encontrarRoteiro(): void {}

    static editarRoteiro(): void {}
}