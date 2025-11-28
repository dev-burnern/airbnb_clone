import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportService } from '../support/support.service';
import { SupportController } from '../support/support.controller';
import { SupportTicket, TicketMessage } from '../support/ticket.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SupportTicket, TicketMessage])],
    providers: [SupportService],
    controllers: [SupportController],
    exports: [SupportService],
})
export class CmsModule { }
