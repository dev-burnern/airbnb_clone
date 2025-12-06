import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { Listing } from '../listings/listing.entity';
import { User } from '../users/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
    constructor(
        @InjectRepository(Wishlist)
        private wishlistsRepository: Repository<Wishlist>,
        @InjectRepository(Listing)
        private listingsRepository: Repository<Listing>,
    ) { }

    /**
     * 새 위시리스트 생성
     */
    async create(user: User, createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
        const wishlist = this.wishlistsRepository.create({
            name: createWishlistDto.name,
            user,
            listings: [],
        });
        return this.wishlistsRepository.save(wishlist);
    }

    /**
     * 사용자의 모든 위시리스트 조회
     */
    async findAll(user: User): Promise<Wishlist[]> {
        return this.wishlistsRepository.find({
            where: { user: { id: user.id } },
            relations: ['listings'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 특정 위시리스트 상세 조회
     */
    async findOne(user: User, id: string): Promise<Wishlist> {
        const wishlist = await this.wishlistsRepository.findOne({
            where: { id },
            relations: ['listings', 'user'],
        });

        if (!wishlist) {
            throw new NotFoundException('위시리스트를 찾을 수 없습니다.');
        }

        if (wishlist.user.id !== user.id) {
            throw new ForbiddenException('이 위시리스트에 접근할 권한이 없습니다.');
        }

        return wishlist;
    }

    /**
     * 위시리스트 수정
     */
    async update(user: User, id: string, updateWishlistDto: UpdateWishlistDto): Promise<Wishlist> {
        const wishlist = await this.findOne(user, id);

        Object.assign(wishlist, updateWishlistDto);
        return this.wishlistsRepository.save(wishlist);
    }

    /**
     * 위시리스트 삭제
     */
    async remove(user: User, id: string): Promise<void> {
        const wishlist = await this.findOne(user, id);
        await this.wishlistsRepository.remove(wishlist);
    }

    /**
     * 위시리스트에 숙소 추가
     */
    async addListing(user: User, wishlistId: string, listingId: string): Promise<Wishlist> {
        const wishlist = await this.findOne(user, wishlistId);

        const listing = await this.listingsRepository.findOne({
            where: { id: listingId },
        });

        if (!listing) {
            throw new NotFoundException('숙소를 찾을 수 없습니다.');
        }

        // 이미 포함된 숙소인지 확인
        const isAlreadyAdded = wishlist.listings.some((l) => l.id === listingId);
        if (!isAlreadyAdded) {
            wishlist.listings.push(listing);
            await this.wishlistsRepository.save(wishlist);
        }

        return wishlist;
    }

    /**
     * 위시리스트에서 숙소 제거
     */
    async removeListing(user: User, wishlistId: string, listingId: string): Promise<Wishlist> {
        const wishlist = await this.findOne(user, wishlistId);

        wishlist.listings = wishlist.listings.filter((l) => l.id !== listingId);
        return this.wishlistsRepository.save(wishlist);
    }
}
