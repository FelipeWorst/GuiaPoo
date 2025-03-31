

export class Guia {
    protected idGuia: number
    protected nome: String
    protected viagens: number

    constructor(idGuia: number, nome: string, viagens: number){
        this.idGuia = idGuia
        this.nome = nome
        this.viagens = viagens
    }

    static mostrarDados(): void {

    }

    static deletarGuia(): void {

    }

    static encontrarGuia(): void {

    }

    static editarGuia(): void {

    }
}