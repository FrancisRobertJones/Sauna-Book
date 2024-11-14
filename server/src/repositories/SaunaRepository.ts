import { Service } from 'typedi';
import { Sauna, ISauna } from '../models/Sauna';

@Service()
export class SaunaRepository {
    async create(saunaData: Partial<ISauna>): Promise<ISauna> {
        const sauna = new Sauna(saunaData);
        return sauna.save();
    }

    async findById(id: string): Promise<ISauna | null> {
        return Sauna.findById(id);
    }

    async findByAdminId(adminId: string): Promise<ISauna[]> {
        return Sauna.find({ adminId });
    }
}