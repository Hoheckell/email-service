import { Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { ProfessoresService } from './professores.service';
import { ProfessorDto } from './dto/professor.dto';
import { Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('professores')
export class ProfessoresController {
    constructor(private readonly professoresService: ProfessoresService) {}

    @Patch('/:authId')
    async update(@Body() professorDto: ProfessorDto, @Request() req) {
        return this.professoresService.update(professorDto, req.params.authId);
    }
}
