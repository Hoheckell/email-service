import { Body, Controller, Get, Param, Post, UploadedFile, Request, UseGuards, UseInterceptors, Headers, UnauthorizedException } from '@nestjs/common';
import { MateriaisService } from './materiais.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MaterialDto } from './dto/material.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRoleEnum } from '../auth/enum/enums';

@UseGuards(JwtAuthGuard)
@Controller('materiais')
export class MateriaisController {
    constructor(private readonly materiaisService: MateriaisService) {}
    
    @Get('/:turmaId')
    async getMateriaisTurma(@Headers('authorization') authHeader: string, @Param('turmaId') turmaId: number, @Headers('x-token') token: string) {
        const authToken = authHeader.replace('Bearer ', '');
        if (token != process.env.X_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }
        return await this.materiaisService.getMateriais(turmaId, authToken);
    }

    @Post('/:role')
    @UseInterceptors(FileInterceptor('file'))
    async createMaterial(@Request() req,
     @Headers('authorization') authHeader: string, 
     @UploadedFile() file: Express.Multer.File | null, 
     @Headers('x-token') token: string, 
     @Param('authId') authId: string, 
     @Param('role') role: UserRoleEnum) { 
        const authToken = authHeader.replace('Bearer ', '');
        if (token != process.env.X_TOKEN) {
                    throw new UnauthorizedException('Token inválido');
                }
        return await this.materiaisService.createMaterial(req.body,file, authToken, role);
    }

    
}
