import { Controller, Post, Body, Get, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { SupportService } from './support.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Support')
@Controller('support')
@UseGuards(AuthGuard('jwt'))
export class SupportController {
    constructor(private supportService: SupportService) { }

    @Post('tickets')
    @ApiOperation({ summary: '지원 티켓 생성' })
    async createTicket(@Request() req, @Body() body: { subject: string; description: string }) {
        return this.supportService.createTicket(req.user, body.subject, body.description);
    }

    @Get('tickets')
    @ApiOperation({ summary: '모든 지원 티켓 조회' })
    async findAll() {
        return this.supportService.findAll();
    }

    @Get('tickets/:id')
    @ApiOperation({ summary: 'ID로 지원 티켓 조회' })
    async findOne(@Param('id') id: string) {
        return this.supportService.findOne(id);
    }

    @Post('tickets/:id/messages')
    @ApiOperation({ summary: '티켓에 메시지 추가' })
    async addMessage(@Request() req, @Param('id') id: string, @Body() body: { content: string }) {
        return this.supportService.addMessage(id, req.user, body.content);
    }

    @Post('tickets/:id/assign')
    @ApiOperation({ summary: '티켓 담당자 지정' })
    async assignTicket(@Param('id') id: string, @Body() body: { agentId: string }) {
        return this.supportService.assignTicket(id, body.agentId);
    }

    @Post('tickets/:id/resolve')
    @ApiOperation({ summary: '티켓 해결 처리' })
    async resolveTicket(@Param('id') id: string) {
        return this.supportService.resolveTicket(id);
    }
}
