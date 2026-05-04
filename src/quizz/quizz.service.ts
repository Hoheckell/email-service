import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QuizDto } from './dto/quizz.dto';
import { TentativaDto } from './dto/tentativa.dto';
import { getSupabaseClient } from '../supabase/supabase.client';
import { IItemArrastavel, IQuiz } from './interface/interfaces';
import { QuestaoEntity } from './entity/questao.entity';
import { OpcaoEntity } from './entity/opcao.entity';
import { QuestaoDto } from './dto/questao.dto';
import { OpcaoDto } from './dto/opcao.dto';
import { StatusEnum, TipoQuestaoEnum } from '../auth/enum/enums';
import { TurmaDto } from '../turmas/dto/turma.dto';
import { TurmaAlunoDto } from '../turmas/dto/turma-aluno.dto';
import { RespostaDto } from './dto/resposta.dto';
import { StatusTentativaEnum } from '../enums/status-tentativa.enum';

@Injectable()
export class QuizzService {

    async deleteTentativa(id: string, authHeader: string): Promise<boolean> {
        const supabase = getSupabaseClient(authHeader);
        const { error } = await supabase
            .from('tentativas')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }

    async findOneTentativa(id: string, authHeader: string): Promise<TentativaDto> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase
            .from('tentativas')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return TentativaDto.fromJson(data);
    }

    async findQuizzesByTurma(turmaId: number, authHeader: string): Promise<QuizDto[]> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase
            .from('quizzes')
            .select(`*, questoes(*, opcoes(*))`) 
            .eq('turma_id', turmaId)
            .order('ordem', { referencedTable: 'questoes', ascending: true })
            .order('ordem', { referencedTable: 'questoes.opcoes', ascending: true });

        if (error) {
            console.error(error);
            throw new InternalServerErrorException('Erro ao buscar quizzes no Supabase');
        }

        if (!data) return [];

        return data.map((quizzRaw: any) => QuizDto.fromSupabase(quizzRaw));
    }

    async createTentativa(resposta: RespostaDto[], authHeader: string, quizId: string, alunoId: string, concluir: boolean): Promise<TentativaDto> {
        const supabase = getSupabaseClient(authHeader);
        let nota = 0;
        for(const itemResposta of resposta){
            const { data:questoes, error:questoesError } = await supabase
                .from('questoes')
                .select('*,opcoes(*)')
                .eq('id', itemResposta.questao_id)
            if (questoesError) throw questoesError;
            if(questoes){
                for(const questao of questoes){
                    if(questao.tipo == TipoQuestaoEnum.SINGLE_CHOICE || questao.tipo == TipoQuestaoEnum.MULTIPLE_CHOICE){
                        for(const opcao of questao.opcoes){
                            if(questao.tipo == TipoQuestaoEnum.SINGLE_CHOICE){
                                if(opcao.id == itemResposta.resposta[0] && opcao.is_correta){
                                    nota += questao.pontuacao_peso;
                                }
                            }else if(questao.tipo == TipoQuestaoEnum.MULTIPLE_CHOICE){
                                itemResposta.resposta.forEach(item => {
                                    if(opcao.id == item && opcao.is_correta){
                                        nota += questao.pontuacao_peso;
                                    }
                                });
                            }
                        }
                    }else if(questao.tipo == TipoQuestaoEnum.DRAG_AND_DROP){
                            const zonasRespostas = Object.entries(itemResposta.resposta);
                            for (const [zonaOndeFoiSoltoId, itensSoltos] of zonasRespostas) {
                                const itens = itensSoltos as IItemArrastavel[];
                                for (const item of itens) {
                                    const itemGabarito = (questao.configuracao.itens_arrastaveis as IItemArrastavel[]).find(
                                        (i) => i.id === item.id
                                    );
                                    if(itemGabarito){
                                        if(itemGabarito.zona_correta_id === zonaOndeFoiSoltoId){
                                            nota += questao.pontuacao_peso;
                                        }
                                    }
                                }
                            }
                        } else if(questao.tipo == TipoQuestaoEnum.CODE_SUBMISSION){
                            
                        }
                    }
                }
        }
        const tentativa = TentativaDto.fromClass({
            quiz_id: quizId,
            aluno_id: alunoId,
            status: concluir ? StatusTentativaEnum.CONCLUIDA : StatusTentativaEnum.EM_ANDAMENTO,
            nota_final: nota,
            iniciada_em: new Date(),
            concluida_em: concluir ? new Date() : undefined,
            respostas: resposta,
        });
        const entity = tentativa.toEntity();
        const { data, error } = await supabase
            .from('tentativas')
            .insert(entity)
            .select()
            .single();
        if (error) throw error;
        return TentativaDto.fromSupabase(data);
    }

    async create(quizz: QuizDto, authHeader: string): Promise<QuizDto> {
        try {
            const supabase = getSupabaseClient(authHeader);
            const entity = quizz.toEntity();
            const questoes = entity.questoes;
            delete entity.id;
            delete entity.questoes;
            delete entity.turma;
            delete entity.tentativas;
            delete entity.totalTentativas;
            const questoesDtos: QuestaoDto[] = [];
            const opcoesDtos: OpcaoDto[] = [];
            const { data: quizData, error: quizError } = await supabase
                .from('quizzes')
                .insert(entity)
                .select('*')
                .single();
            if (quizError) throw quizError;
            if(questoes && questoes.length > 0){
                console.log(quizData);
                const quizz = QuizDto.fromSupabase(quizData);
                const quizId = quizz.id;
                for(const questao of questoes){
                    const opcoes = questao.opcoes;
                    delete questao.id;
                    delete questao.opcoes;                
                    const { data: questaoData, error: questoesError } = await supabase
                        .from('questoes')
                        .insert({ ...questao, quiz_id: quizId })
                        .select('*')
                        .single();
                    if (questoesError) throw questoesError;
                    console.log(questaoData);
                    const questaoDto = QuestaoDto.fromSupabase(questaoData);
                    questoesDtos.push(questaoDto);
                    const questaoId = questaoDto.id;
                    if(opcoes && opcoes.length > 0){
                        for(const opcao of opcoes){
                            const { data: opcaoData, error: opcoesError } = await supabase
                            .from('opcoes')
                            .insert({ ...opcao, questao_id: questaoId })
                            .select('*')
                            .single();
                            if (opcoesError) throw opcoesError;
                            const opcaoDto = OpcaoDto.fromSupabase(opcaoData);
                            opcoesDtos.push(opcaoDto);
                        }
                    }
                }
            }
            quizz.questoes = questoesDtos;
            quizz.questoes.forEach((questao, index) => {
                questao.opcoes = opcoesDtos.filter((opcao) => opcao.questao_id === questao.id);
            });
            return quizz;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findAll(authHeader: string): Promise<QuizDto[]> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase
        .from('quizzes')
        .select(`
            *, 
            turmas (*), 
            tentativas (*),
            questoes (*, opcoes(*))
        `).order('criado_em', { ascending: false }).maybeSingle();

        if (error) {
            console.error(error);
            throw error;
        }

        if (!data) return [];

        if(Array.isArray(data)){
            return data.map((quizzRaw: any) => QuizDto.fromSupabase(quizzRaw));
        }else{
            return [QuizDto.fromSupabase(data)];
        }
    }

    async findOne(id: string, authHeader: string): Promise<QuizDto> {
        const supabase = getSupabaseClient(authHeader);
        console.log('id', id);
        const { data, error } = await supabase
            .from('quizzes')
            .select(`*,questoes(*,opcoes(*))`)
            .eq('id', id)
            .single();
        if (error) throw error;
        return QuizDto.fromSupabase(data);
    }

    async update(id: string, quizz: QuizDto, authHeader: string): Promise<QuizDto> {
        const supabase = getSupabaseClient(authHeader);
        const entity = quizz.toEntity();
        delete entity.id;
        const questoes = entity.questoes;
        delete entity.questoes;
        delete entity.turma;
        delete entity.tentativas;
        delete entity.totalTentativas;
        const { data, error } = await supabase
            .from('quizzes')
            .update(entity)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        const questoesDtos: QuestaoDto[] = [];
        const opcoesDtos: OpcaoDto[] = [];
        const quizzdata = QuizDto.fromSupabase(data);
        if(questoes && questoes.length > 0){
            for(const questao of questoes){
                const opcoes = questao.opcoes;
                const questaoId = questao.id;
                delete questao.id;
                delete questao.opcoes;                
                const { data: questaoData, error: questoesError } = await supabase
                    .from('questoes')
                    .update(questao)
                    .eq('id', questaoId)
                    .select('*')
                    .single();
                if (questoesError) throw questoesError;
                console.log(questaoData);
                const questaoDto = QuestaoDto.fromSupabase(questaoData);
                questoesDtos.push(questaoDto);
                if(opcoes && opcoes.length > 0){
                    for(const opcao of opcoes){
                        const opcaoId = opcao.id;
                        delete opcao.id;
                        const { data: opcaoData, error: opcoesError } = await supabase
                        .from('opcoes')
                        .update(opcao)
                        .eq('id', opcaoId)
                        .select('*')
                        .single();
                        if (opcoesError) throw opcoesError;
                        const opcaoDto = OpcaoDto.fromSupabase(opcaoData);
                        opcoesDtos.push(opcaoDto);
                    }
                }
            }
        }
        quizz.questoes = questoesDtos;
        quizz.questoes.forEach((questao, index) => {
            questao.opcoes = opcoesDtos.filter((opcao) => opcao.questao_id === questao.id);
        });
        return quizz;
    }

    async remove(id: string, authHeader: string): Promise<boolean> {
        const supabase = getSupabaseClient(authHeader);
        const { error } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }

    async updateStatus(id: string, status: StatusEnum, token: string): Promise<QuizDto> {
        const supabase = getSupabaseClient(token);
        const { data, error } = await supabase
            .from('quizzes')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return QuizDto.fromSupabase(data);
    }

    async getQuizzesByAluno(authId: string, authHeader: string): Promise<QuizDto[]> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase
            .from('turmas_alunos')
            .select(`turmas(*, quizzes(*,tentativas(*)))`)
            .eq('aluno_id', authId).maybeSingle();
        if (error) throw error;
        if(!data) return []; 
        const quizzes: QuizDto[] = [];
        if(Array.isArray(data.turmas)){
            const turmas: TurmaDto[] = data.turmas.map((turma: TurmaDto) => TurmaDto.fromSupabase(turma));
            for(const turma of turmas){            
                if(turma.quizzes){
                    const quizzesTurma: QuizDto[] = turma.quizzes.map((quiz: QuizDto) => QuizDto.fromSupabase(quiz));
                    quizzes.push(...quizzesTurma);
                }
            }
        }else{
            const turma: TurmaDto = TurmaDto.fromSupabase(data.turmas);
            console.log(turma);
            if(turma.quizzes){
                const quizzesTurma: QuizDto[] = turma.quizzes.map((quiz: QuizDto) => QuizDto.fromSupabase(quiz));
                quizzes.push(...quizzesTurma);
            }
        }
        return quizzes;
    }

    async getTentativasByAluno(quizId: string, alunoId: string | null = null, authHeader: string): Promise<TentativaDto[]> {
        const supabase = getSupabaseClient(authHeader);
            let query = supabase
            .from('tentativas')
            .select(`*, aluno(*)`)
            .eq('quiz_id', quizId);
        if(alunoId){
            query = query.eq('aluno_id', alunoId);
        }
        const { data, error } = await query.order('iniciada_em', { ascending: false }).maybeSingle();
        if (error) throw error;
        if(!data) return []; 
        const tentativas: TentativaDto[] = data.map((tentativa: TentativaDto) => TentativaDto.fromSupabase(tentativa));
        return tentativas;
    }

    async getTentativasDraftByAluno(alunoId: string, authHeader: string): Promise<TentativaDto[]> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase
            .from('tentativas')
            .select(`*, quizzes(*)`) 
            .eq('aluno_id', alunoId)
            .eq('status', StatusTentativaEnum.EM_ANDAMENTO)
            .order('iniciada_em', { ascending: false });
        if (error) throw error;
        if(!data) return []; 
        const tentativas: TentativaDto[] = data.map((tentativa: TentativaDto) => TentativaDto.fromSupabase(tentativa));
        return tentativas;
    }

} 
