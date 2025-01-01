import mongoose, { Types } from 'mongoose';
import { Service } from 'typedi';
import { ApplicationError } from '../utils/errors';
import { IWaitingList, WaitingList } from '../models/WaitList';

@Service()
export class WaitingListRepository {
  async create(data: {
    userId: string,
    saunaId: string,
    slotTime: Date,
    bookingId: string
  }): Promise<IWaitingList> {
    const waitlistEntry = new WaitingList({
      ...data,
      saunaId: new mongoose.Types.ObjectId(data.saunaId),
      bookingId: new mongoose.Types.ObjectId(data.bookingId)
    });

    return waitlistEntry.save();
  }

  async findBySlot(saunaId: string, slotTime: Date): Promise<IWaitingList[]> {
    console.log('Finding by slot with saunaId:', saunaId); 
    
    try {
        const objectId = new mongoose.Types.ObjectId(saunaId);
        return WaitingList.find({
            saunaId: objectId,
            slotTime,
            notified: false
        }).sort({ createdAt: 1 });
    } catch (error) {
        console.error('Error converting saunaId to ObjectId:', error);
        console.error('Received saunaId:', saunaId);
        throw error;
    }
}

  async removeFromWaitlist(userId: string, saunaId: string, slotTime: Date): Promise<void> {
    await WaitingList.deleteOne({ userId, saunaId, slotTime });
  }

 async markAsNotified(id: string): Promise<void> {
        await WaitingList.findByIdAndUpdate(id, {
            notified: true
        });
    }

  async getUserWaitlistPositions(userId: string, saunaId: string): Promise<Array<{ slotTime: Date, position: number }>> {
    console.log('Getting positions for:', { userId, saunaId });

    const allUserEntries = await WaitingList.find({ userId });
    console.log('All entries for user:', allUserEntries);

    const userWaitlistEntries = await WaitingList.find({
      userId,
      saunaId: new mongoose.Types.ObjectId(saunaId),
      notified: false
    }).sort({ createdAt: 1 });

    console.log('Filtered entries:', userWaitlistEntries);

    if (userWaitlistEntries.length === 0) {
      return [];
    }

    const positions = await Promise.all(userWaitlistEntries.map(async (entry) => {
      const position = await WaitingList.countDocuments({
        saunaId: new mongoose.Types.ObjectId(saunaId),
        slotTime: entry.slotTime,
        notified: false,
        createdAt: { $lt: entry.createdAt }
      }) + 1;

      return {
        slotTime: entry.slotTime,
        position
      };
    }));

    console.log('Calculated positions:', positions);
    return positions;
  }
}