import { Service } from 'typedi';
import { Sauna, ISauna } from '../models/Sauna';
import { ApplicationError } from '../utils/errors';

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

    async update(id: string, updates: Partial<ISauna>): Promise<ISauna> {
        const updated = await Sauna.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        ).exec();
        
        if (!updated) {
            throw new ApplicationError('Sauna not found', 404);
        }
        
        return updated;
    }

    async deleteSauna(saunaId: string): Promise<void> {
        await Sauna.findByIdAndDelete(saunaId);
      }
}