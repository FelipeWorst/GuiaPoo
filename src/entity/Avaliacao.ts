export class Avaliacao {
    public id_avaliacao?: number
    public nota?: number
    public comentario?: string
    public data_avaliacao: string

    constructor(id_avaliacao?: number, nota?: number, comentario?: string, data_avaliacao = "") {
        this.id_avaliacao = id_avaliacao
        this.nota = nota
        this.comentario = comentario
        this.data_avaliacao = data_avaliacao
    }

    public getId(): number | undefined {
        return this.id_avaliacao
    }

    public getNota(): number | undefined {
        return this.nota
    }
    
    public getComentario(): string {
        return this.comentario ?? ""
    }
    
    public getDataAvaliacao(): string {
        return this.data_avaliacao
    }

    public setId(id: number): void {
        this.id_avaliacao = id;
    }

    public setNota(nota: number): void {
        if (nota < 1 || nota > 10) {
            throw new Error("A nota deve estar entre 1 e 10.")
        }
        this.nota = nota
    }

    public setComentario(comentario: string): void {
        this.comentario = comentario
    }

    public setDataAvaliacao(data_avaliacao: string): void {
        this.data_avaliacao = data_avaliacao
    }
}