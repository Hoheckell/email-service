import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { getSupabaseClient } from '../supabase/supabase.client';
import { JwtService } from '@nestjs/jwt';
import { AlunosService } from '../alunos/alunos.service';
import { ProfessoresService } from '../professores/professores.service';
import { SignupDto } from './dto/signup.dto';
import { UserRoleEnum } from './enum/enums';
import { AlunoDto } from '../alunos/dto/aluno.dto';
import { MailService } from '../mail/mail.service';
import { SendMailDto } from '../mail/dto/send-mail.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly alunosService: AlunosService,
    private readonly professoresService: ProfessoresService,
    private readonly emailService: MailService,
    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, pass: string, userRole: UserRoleEnum): Promise<{
    access_token: string;
    role: string;
    user: AlunoDto;
  }> {
    const supabase = getSupabaseClient();
    // 1. O Nest pede ao Supabase para verificar a senha
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // 2. O Nest busca os dados do perfil (ID int8, Nome, Turma)
    //    Isso evita que o Flutter tenha que fazer duas chamadas.
    const table = userRole === UserRoleEnum.ALUNO ? 'alunos' : 'professores';
    const profileResp = await supabase
      .from(table)
      .select('*')
      .eq('auth_id', data.user.id) // O vínculo UUID -> Int8
      .single();

    const profile = profileResp.data;

    if (!profile) {
      throw new UnauthorizedException('Perfil de usuário não encontrado.');
    }

    // 3. O Nest gera um TOKEN DE ACESSO (JWT) próprio para o Flutter
    //    Não mandamos o token do Supabase para o Flutter, mandamos o do Nest.
    const accessToken = this.jwtService.sign({
      sub: data.user.id, // UUID
      role: 'authenticated', // 'ALUNO'
      email: data.user.email,
      user_role: userRole,
      user_id: profile.id, // Guardamos o UUID caso precise
    });

    return {
      access_token: accessToken,
      role: userRole,
      user: AlunoDto.fromSupabase(profile, userRole), // Já devolvemos nome, foto, turma, etc.
    };
  }

  private gerarCodigoAlfanumerico(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let buffer = '';

    // Cria um array tipado para armazenar 6 valores aleatórios seguros
    const randomValues = new Uint32Array(6);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < 6; i++) {
      // Calcula o índice com base no valor aleatório gerado
      const index = randomValues[i] % caracteres.length;
      buffer += caracteres[index];
    }

    return buffer;
  }

  async signup(dto: SignupDto): Promise<AlunoDto | { error: string }> {
    try{
      const supabase = getSupabaseClient();
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
        {
          email: dto.email,
          password: dto.senha,
        },
      );
      let alunoDto;

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error(
            'Este username já está em uso por outro aluno ou a senha está incorreta.',
          );
        }
      }

      if (signUpData.user) {
        const table = dto.role === UserRoleEnum.ALUNO ? 'alunos' : 'professores';
        const { error: perfilError, data: perfilData } = await supabase.from(table).insert({
          auth_id: signUpData.user.id,
          email: signUpData.user.email,
          senha: signUpData.user.user_metadata.password,
          nome: dto.nome,
          whatsapp: dto.whatsapp,
          codigo: dto.confirmationCode ? dto.confirmationCode : dto.codigo,
          ativo: dto.ativo,
        }).select('*').maybeSingle();

        if (perfilError) throw perfilError;

      if (dto.confirmationCode && dto.role === UserRoleEnum.ALUNO && dto.codigo) {
        const { data: turma, error: turmaError } = await supabase
        .from('turmas')
        .select('*')
        .eq('codigo', dto.codigo)
        .maybeSingle();
        if (turmaError) throw turmaError;
        if (!turma) throw new Error('Turma não encontrada');

        const { error: turmaAlunoError } = await supabase
        .from('turmas_alunos')
        .insert({
          turma_id: turma.id,
          aluno_id: signUpData.user.id,
        }).maybeSingle();
        if (turmaAlunoError) throw turmaAlunoError;
      }

        const accessToken = this.jwtService.sign({
          sub: signUpData.user.id, // UUID
          role: 'authenticated',
          user_role: dto.role,
          email: signUpData.user.email,
          user_id: perfilData.id, // Guardamos o UUID caso precise
        });


        alunoDto = AlunoDto.fromJson({
          authId: signUpData.user.id ?? '',
          email: signUpData.user.email ?? '',
          nome: dto.nome,
          whatsapp: dto.whatsapp,
          codigo: dto.confirmationCode ? dto.confirmationCode : dto.codigo,
          ativo: dto.ativo,
          token: accessToken,
          id: perfilData.id,
        });
        
        const sendMailDto = new SendMailDto();
        sendMailDto.to = dto.email;
        sendMailDto.subject = '[ClassConnect] - Confirmação de cadastro';
        sendMailDto.template = 'confirm';
        sendMailDto.context = {        
          name: alunoDto.nome,
          code: alunoDto.codigo,
        };
        await this.emailService.sendMail(sendMailDto);
        
      }
      return alunoDto;
    }catch(error){
      console.log('Error:', error);
      return { error: error.message };
    }
  }
}
