export interface InterfaceRepository <T>{
    mapear(row: any): T

    listar(): Promise<T[]>

    buscarPorId(id: number): Promise<T | null>

    inserir(entidade: T): Promise<T>

    remover(id: number): Promise<string>

    atualizar(id: number, entidade: Partial<T>): Promise<T>;
  }