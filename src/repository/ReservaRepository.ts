import { Pool } from "pg"
import { Database } from "./Database"
import { Reserva } from "../entity/Reserva"
import { InterfaceRepository } from "./InterfaceRepository";

export class ReservaRepository implements InterfaceRepository<Reserva> {
    private pool: Pool;

    constructor() {
        this.pool = Database.iniciarConexao()
    }
    public mapear(row: any): Reserva {
        //console.log(row.id_passeio)
        return new Reserva(row.id_reserva, row.data_reserva, row.data_volta, row.pago, row.email_usuario, row.id_passeio, row.valor)

    }

    async listar(): Promise<Reserva[]> {
        const query = "SELECT * FROM guia.reserva"
        const result = await this.pool.query(query)
        //console.log(result)
        return result.rows.map(this.mapear)
        
    }

    async buscarPorId(id: number): Promise<Reserva | null> {
        const query = "SELECT * FROM guia.reserva WHERE id_reserva = $1"
        const result = await this.pool.query(query, [id])
        if (result.rowCount === 0) {
            return null
        }
        return this.mapear(result.rows[0])
    }
    async inserir(dados: Reserva): Promise<Reserva> {
        const { idReserva, dataReserva, dataVolta, pago, emailUsuario, idPasseio, valor } = dados
    
        const ReservaExistente = await this.buscarPorId(idReserva)
        if (ReservaExistente) {
            throw new Error("Não é possível criar uma reserva. O ID já está sendo utilizado.")
        }
     
        const query = `INSERT INTO guia.Reserva(id_reserva, data_reserva, data_volta, pago, email_usuario, id_passeio, valor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
        const valores = [ idReserva, dataReserva, dataVolta, pago, emailUsuario, idPasseio, valor];
    
        try {
            const { rows } = await this.pool.query(query, valores)
            
            return new Reserva(rows[0].idReserva, rows[0].dataReserva, rows[0].dataVolta, rows[0].pago, rows[0].emailUsuario, rows[0].idPasseio, rows[0].valor)
        } catch (error) {
            throw new Error("Erro ao inserir reserva no banco de dados.")
        }
    }

    async remover(id: number): Promise<string> {
        try {
            const query = "DELETE FROM guia.Reserva WHERE id_reserva = $1"
            await this.pool.query(query, [id])
            return "Reserva removido com sucesso"
        }
        catch (error) {
            console.error("Erro ", error)
            throw new Error("Reserva nao existente")
        }
    }
    async atualizar(id: number, entidade: Reserva): Promise<Reserva> {
        try {
            const campos: string[] = [];
            const valores: any[] = [];
            let index = 1;
    
            if (entidade.idPasseio !== undefined && entidade.idPasseio !== null && entidade.idPasseio.toString() !== ""){
                campos.push(`id_passeio = $${index}`);
                valores.push(entidade.idPasseio); 
                index++;
            }
    
            if (entidade.emailUsuario && entidade.emailUsuario !== "") {
                campos.push(`email_usuario = $${index}`);
                valores.push(entidade.emailUsuario);
                index++;
            }
    
            if (entidade.dataReserva && entidade.dataReserva !== "") {
                campos.push(`data_reserva = $${index}`);
                valores.push(entidade.dataReserva);
                index++;
            }
    
            if (entidade.dataVolta && entidade.dataVolta !== "") {
                campos.push(`data_volta = $${index}`);
                valores.push(entidade.dataVolta);
                index++;
            }
    
            if (entidade.valor !== undefined && entidade.valor !== null && entidade.valor.toString() !== "") {
                campos.push(`valor = $${index}`);
                valores.push(entidade.valor);
                index++;
            }
    
            if (entidade.pago !== undefined && entidade.pago !== null) {
                campos.push(`pago = $${index}`);
                valores.push(entidade.pago);
                index++;
            }
    
            if (campos.length === 0) {
                throw new Error("Nenhum campo foi atualizado.");
            }
    
            valores.push(id);
            const query = `UPDATE guia.reserva SET ${campos.join(", ")} WHERE id_reserva = $${index} RETURNING *`;
    
            console.log("Query de atualização:", query);
            console.log("Valores enviados:", valores);
    
            const result = await this.pool.query(query, valores);
    
            if (result.rowCount === 0) {
                throw new Error("Reserva não encontrada.");
            }
    
            return this.mapear(result.rows[0]);
    
        } catch (error) {
            console.error("Erro ao atualizar reserva:", error);
            throw new Error("Falha ao atualizar reserva.");
        }
    }
}
