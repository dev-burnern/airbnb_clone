import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
    constructor(private listingsService: ListingsService) { }

    @Get()
    @ApiOperation({ summary: 'Find all listings with filters' })
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
    @ApiOperation({ summary: 'Find a listing by ID' })
    async findOne(@Param('id') id: string) {
        return this.listingsService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: 'Create a new listing' })
    async create(@Request() req, @Body() listingData: any) {
        return this.listingsService.create({
            ...listingData,
            host: req.user,
        });
    }
}