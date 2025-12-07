import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './listing.entity';

@Injectable()
export class ListingsService {
    constructor(
        @InjectRepository(Listing)
        private listingsRepository: Repository<Listing>,
    ) { }

    async create(listingData: Partial<Listing>): Promise<Listing> {
        const listing = this.listingsRepository.create(listingData);
        return this.listingsRepository.save(listing);
    }

    async findAll(query: any): Promise<Listing[]> {
        const qb = this.listingsRepository.createQueryBuilder('listing');

        // Location Filter (Viewport)
        if (query.minLat && query.maxLat && query.minLng && query.maxLng) {
            qb.andWhere('listing.latitude BETWEEN :minLat AND :maxLat', {
                minLat: query.minLat,
                maxLat: query.maxLat,
            });
            qb.andWhere('listing.longitude BETWEEN :minLng AND :maxLng', {
                minLng: query.minLng,
                maxLng: query.maxLng,
            });
        } else if (query.city) {
            qb.andWhere('listing.city LIKE :city', { city: `%${query.city}%` });
        }

        // Price Filter
        if (query.minPrice) {
            qb.andWhere('listing.priceConfig >= :minPrice', { minPrice: query.minPrice });
        }
        if (query.maxPrice) {
            qb.andWhere('listing.priceConfig <= :maxPrice', { maxPrice: query.maxPrice });
        }

        // Guest Capacity
        if (query.guests) {
            qb.andWhere('listing.maxGuests >= :guests', { guests: query.guests });
        }

        // Category/Type
        if (query.type) {
            qb.andWhere('listing.type = :type', { type: query.type });
        }

        // Date Availability (Exclude overlapping bookings)
        if (query.checkIn && query.checkOut) {
            const checkIn = new Date(query.checkIn);
            const checkOut = new Date(query.checkOut);

            qb.leftJoin('listing.bookings', 'booking');
            qb.andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('1')
                    .from('bookings', 'b')
                    .where('b.listingId = listing.id')
                    .andWhere('b.status IN (:...statuses)', { statuses: ['CONFIRMED', 'PAID'] })
                    .andWhere('b.checkIn < :checkOut AND b.checkOut > :checkIn')
                    .getQuery();
                return `NOT EXISTS ${subQuery}`;
            });
            qb.setParameter('checkIn', checkIn);
            qb.setParameter('checkOut', checkOut);
        }

        return qb.getMany();
    }

    async findOne(id: string): Promise<Listing | null> {
        return this.listingsRepository.findOne({ where: { id }, relations: ['host', 'reviews'] });
    }

    async update(id: string, updateData: Partial<Listing>): Promise<Listing> {
        await this.listingsRepository.update(id, updateData);
        const updated = await this.findOne(id);
        if (!updated) {
            throw new Error('업데이트된 숙소를 찾을 수 없습니다');
        }
        return updated;
    }

    async remove(id: string): Promise<{ deleted: boolean; message: string }> {
        const result = await this.listingsRepository.delete(id);
        return {
            deleted: result.affected ? result.affected > 0 : false,
            message: result.affected ? '숙소가 삭제되었습니다' : '삭제할 숙소를 찾을 수 없습니다',
        };
    }
}
