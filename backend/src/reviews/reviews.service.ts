import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Listing } from '../listings/listing.entity';
import { User } from '../users/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(Listing)
        private listingsRepository: Repository<Listing>,
    ) { }

    /**
     * 새 리뷰 작성
     */
    async create(user: User, createReviewDto: CreateReviewDto): Promise<Review> {
        const listing = await this.listingsRepository.findOne({
            where: { id: createReviewDto.listingId },
        });

        if (!listing) {
            throw new NotFoundException('숙소를 찾을 수 없습니다.');
        }

        const review = this.reviewsRepository.create({
            content: createReviewDto.content,
            rating: createReviewDto.rating,
            listing,
            listingId: createReviewDto.listingId,
            author: user,
            authorId: user.id,
        });

        return this.reviewsRepository.save(review);
    }

    /**
     * 내 리뷰 목록 조회
     */
    async findMyReviews(user: User): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { authorId: user.id },
            relations: ['listing', 'author'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 특정 숙소의 리뷰 목록 조회
     */
    async findByListing(listingId: string): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { listingId },
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 특정 사용자의 리뷰 목록 조회 (프로필 페이지용)
     */
    async findByUser(userId: string): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { authorId: userId },
            relations: ['listing', 'author'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 리뷰 상세 조회
     */
    async findOne(id: string): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['listing', 'author'],
        });

        if (!review) {
            throw new NotFoundException('리뷰를 찾을 수 없습니다.');
        }

        return review;
    }

    /**
     * 리뷰 수정
     */
    async update(user: User, id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const review = await this.findOne(id);

        if (review.authorId !== user.id) {
            throw new ForbiddenException('이 리뷰를 수정할 권한이 없습니다.');
        }

        Object.assign(review, updateReviewDto);
        return this.reviewsRepository.save(review);
    }

    /**
     * 리뷰 삭제
     */
    async remove(user: User, id: string): Promise<void> {
        const review = await this.findOne(id);

        if (review.authorId !== user.id) {
            throw new ForbiddenException('이 리뷰를 삭제할 권한이 없습니다.');
        }

        await this.reviewsRepository.remove(review);
    }

    /**
     * 숙소의 평균 평점 조회
     */
    async getAverageRating(listingId: string): Promise<{ average: number; count: number }> {
        const result = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .addSelect('COUNT(review.id)', 'count')
            .where('review.listing_id = :listingId', { listingId })
            .getRawOne();

        return {
            average: result.average ? parseFloat(result.average) : 0,
            count: parseInt(result.count) || 0,
        };
    }
}
