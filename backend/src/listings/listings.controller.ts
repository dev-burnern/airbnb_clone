import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Query, NotFoundException } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
    constructor(private listingsService: ListingsService) { }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('my')
    @ApiOperation({ summary: '내 숙소 목록 조회' })
    async findMyListings(@Request() req) {
        return this.listingsService.findByHost(req.user.id);
    }

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
        const listing = await this.listingsService.findOne(id);
        if (!listing) {
            throw new NotFoundException(`숙소를 찾을 수 없습니다: ${id}`);
        }
        return listing;
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: '새 숙소 등록' })
    async create(@Request() req, @Body() listingData: any) {
        return this.listingsService.create({
            ...listingData,
            host: req.user,
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Patch(':id')
    @ApiOperation({ summary: '숙소 정보 수정' })
    async update(@Param('id') id: string, @Request() req, @Body() updateData: any) {
        const listing = await this.listingsService.findOne(id);
        if (!listing) {
            throw new NotFoundException(`숙소를 찾을 수 없습니다: ${id}`);
        }
        return this.listingsService.update(id, updateData);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: '숙소 삭제' })
    async remove(@Param('id') id: string, @Request() req) {
        const listing = await this.listingsService.findOne(id);
        if (!listing) {
            throw new NotFoundException(`숙소를 찾을 수 없습니다: ${id}`);
        }
        return this.listingsService.remove(id);
    }
}