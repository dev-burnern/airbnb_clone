import { Controller, Post, Body, Get, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { SupportService } from './support.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('support')
@UseGuards(AuthGuard('jwt'))
export class SupportController {
    constructor(private supportService: SupportService) { }

    @Post('tickets')
    async createTicket(@Request() req, @Body() body: { subject: string; description: string }) {
        return this.supportService.createTicket(req.user, body.subject, body.description);
    }

    @Get('tickets')
    async findAll() {
        return this.supportService.findAll();
    }

    @Get('tickets/:id')
    async findOne(@Param('id') id: string) {
        return this.supportService.findOne(id);
    }

    @Post('tickets/:id/messages')
    async addMessage(@Request() req, @Param('id') id: string, @Body() body: { content: string }) {
        return this.supportService.addMessage(id, req.user, body.content);
    }

    @Post('tickets/:id/assign')
    async assignTicket(@Param('id') id: string, @Body() body: { agentId: string }) {
        return this.supportService.assignTicket(id, body.agentId);
    }

    @Post('tickets/:id/resolve')
    async resolveTicket(@Param('id') id: string) {
        return this.supportService.resolveTicket(id);
    }
}
