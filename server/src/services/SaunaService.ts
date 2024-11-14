import { Service } from 'typedi';

import { ISauna } from '../models/Sauna';
import { SaunaRepository } from '../repositories/SaunaRepository';


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
}