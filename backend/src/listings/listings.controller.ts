import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
    constructor(private listingsService: ListingsService) { }

    @Get()
    @ApiOperation({ summary: '필터를 적용하여 모든 숙소 목록 조회' })
    @ApiQuery({ name: 'minLat', required: false })
    @ApiQuery({ name: 'maxLat', required: false })
    @ApiQuery({ name: 'minLng', required: false })
    @ApiQuery({ name: 'maxLng', required: false })
    @ApiQuery({ name: 'minPrice', required: false })
    @ApiQuery({ name: 'maxPrice', required: false })
    @ApiQuery({ name: 'guests', required: false })
    @ApiQuery({ name: 'checkIn', required: false })
    @ApiQuery({ name: 'checkOut', required: false })
    async findAll(@Query() query: any) {
        return this.listingsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'ID로 숙소 상세 조회' })
    async findOne(@Param('id') id: string) {
        return this.listingsService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: '새 숙소 등록' })
    async create(@Request() req, @Body() listingData: any) {
        return this.listingsService.create({
            ...listingData,
            host: req.user,
        });
    }
}