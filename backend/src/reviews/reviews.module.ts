import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './review.entity';
import { Listing } from '../listings/listing.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Review, Listing])],
    providers: [ReviewsService],
    controllers: [ReviewsController],
    exports: [ReviewsService],
})
export class ReviewsModule { }
