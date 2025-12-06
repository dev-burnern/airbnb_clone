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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AddListingDto } from './dto/add-listing.dto';

@ApiTags('Wishlists')
@ApiBearerAuth()
@Controller('wishlists')
@UseGuards(AuthGuard('jwt'))
export class WishlistsController {
    constructor(private readonly wishlistsService: WishlistsService) { }

    @Post()
    @ApiOperation({ summary: '새 위시리스트 생성' })
    async create(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
        return this.wishlistsService.create(req.user, createWishlistDto);
    }

    @Get()
    @ApiOperation({ summary: '내 위시리스트 목록 조회' })
    async findAll(@Request() req) {
        return this.wishlistsService.findAll(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: '위시리스트 상세 조회' })
    @ApiParam({ name: 'id', description: '위시리스트 ID' })
    async findOne(@Request() req, @Param('id') id: string) {
        return this.wishlistsService.findOne(req.user, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: '위시리스트 수정' })
    @ApiParam({ name: 'id', description: '위시리스트 ID' })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateWishlistDto: UpdateWishlistDto,
    ) {
        return this.wishlistsService.update(req.user, id, updateWishlistDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '위시리스트 삭제' })
    @ApiParam({ name: 'id', description: '위시리스트 ID' })
    async remove(@Request() req, @Param('id') id: string) {
        return this.wishlistsService.remove(req.user, id);
    }

    @Post(':id/listings')
    @ApiOperation({ summary: '위시리스트에 숙소 추가' })
    @ApiParam({ name: 'id', description: '위시리스트 ID' })
    async addListing(
        @Request() req,
        @Param('id') id: string,
        @Body() addListingDto: AddListingDto,
    ) {
        return this.wishlistsService.addListing(req.user, id, addListingDto.listingId);
    }

    @Delete(':id/listings/:listingId')
    @ApiOperation({ summary: '위시리스트에서 숙소 제거' })
    @ApiParam({ name: 'id', description: '위시리스트 ID' })
    @ApiParam({ name: 'listingId', description: '숙소 ID' })
    async removeListing(
        @Request() req,
        @Param('id') id: string,
        @Param('listingId') listingId: string,
    ) {
        return this.wishlistsService.removeListing(req.user, id, listingId);
    }
}
