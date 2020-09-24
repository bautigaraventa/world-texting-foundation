/**
 * Interface methods to access database 
 */
export interface IRepository {
    create(body: any): any;
    delete(id: string): void;
    getAll(): any[];
    getOne(id): any;
    update(id: string, body: any): any;
}
