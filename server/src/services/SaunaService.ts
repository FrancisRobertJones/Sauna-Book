import { Service } from 'typedi';

import { ISauna } from '../models/Sauna';
import { SaunaRepository } from '../repositories/SaunaRepository';
import { ApplicationError } from '../utils/errors';


@Service()
export class SaunaService {
    constructor(private saunaRepository: SaunaRepository
    ) { }

    async createSauna(saunaData: Partial<ISauna>): Promise<ISauna> {
        return this.saunaRepository.create(saunaData);
    }

    async findById(id: string): Promise<ISauna | null> {
        return this.saunaRepository.findById(id);
    }

    async findByAdminId(adminId: string): Promise<ISauna[]> {
        return this.saunaRepository.findByAdminId(adminId);
    }

    async updateSettings(saunaId: string, adminId: string, updates: Partial<ISauna>): Promise<ISauna> {
        const sauna = await this.saunaRepository.findById(saunaId);
        
        if (!sauna || sauna.adminId !== adminId) {
            throw new ApplicationError('Sauna not found or unauthorized', 404);
        }
    
        const allowedUpdates = {
            name: updates.name,
            slotDurationMinutes: updates.slotDurationMinutes,
            operatingHours: updates.operatingHours,
            maxConcurrentBookings: updates.maxConcurrentBookings,
            maxTotalBookings: updates.maxTotalBookings,
            location: updates.location,
            description: updates.description
        };
    
        return this.saunaRepository.update(saunaId, allowedUpdates);
    }

}