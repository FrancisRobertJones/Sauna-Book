import { RequestHandler } from 'express';
import { Receiver } from "@upstash/qstash";

export const verifyQStashSignature: RequestHandler = async (req, res, next) => {
    try {
        if (!process.env.QSTASH_CURRENT_SIGNING_KEY) {
            next(new Error('QSTASH_CURRENT_SIGNING_KEY is not configured'));
            return;
        }

        const receiver = new Receiver({
            currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
            nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || process.env.QSTASH_CURRENT_SIGNING_KEY
        });

        const signature = req.headers['upstash-signature'];
        
        if (!signature || typeof signature !== 'string') {
            next(new Error('Missing QStash signature'));
            return;
        }

        const isValid = await receiver.verify({
            signature,
            body: JSON.stringify(req.body)
        });

        if (!isValid) {
            next(new Error('Invalid QStash signature'));
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
};