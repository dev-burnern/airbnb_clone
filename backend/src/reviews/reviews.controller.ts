import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '새 리뷰 작성' })
    @ApiResponse({ status: 201, description: '리뷰가 성공적으로 작성되었습니다.' })
    async create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(req.user, createReviewDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '내 리뷰 목록 조회' })
    async findMyReviews(@Request() req) {
        return this.reviewsService.findMyReviews(req.user);
    }

    @Get('listing/:listingId')
    @ApiOperation({ summary: '특정 숙소의 리뷰 조회' })
    @ApiParam({ name: 'listingId', description: '숙소 ID' })
    async findByListing(@Param('listingId') listingId: string) {
        return this.reviewsService.findByListing(listingId);
    }

    @Get('listing/:listingId/rating')
    @ApiOperation({ summary: '특정 숙소의 평균 평점 조회' })
    @ApiParam({ name: 'listingId', description: '숙소 ID' })
    async getAverageRating(@Param('listingId') listingId: string) {
        return this.reviewsService.getAverageRating(listingId);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: '특정 사용자의 리뷰 조회' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    async findByUser(@Param('userId') userId: string) {
        return this.reviewsService.findByUser(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: '리뷰 상세 조회' })
    @ApiParam({ name: 'id', description: '리뷰 ID' })
    async findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '리뷰 수정' })
    @ApiParam({ name: 'id', description: '리뷰 ID' })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateReviewDto: UpdateReviewDto,
    ) {
        return this.reviewsService.update(req.user, id, updateReviewDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '리뷰 삭제' })
    @ApiParam({ name: 'id', description: '리뷰 ID' })
    async remove(@Request() req, @Param('id') id: string) {
        return this.reviewsService.remove(req.user, id);
    }
}
