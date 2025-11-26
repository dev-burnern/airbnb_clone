import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsService } from '../listings/listings.service';
import { ListingsController } from '../listings/listings.controller';
import { Listing } from '../listings/listing.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Listing])],
    providers: [ListingsService],
    controllers: [ListingsController],
    exports: [ListingsService],
})
export class ListingsModule { }
