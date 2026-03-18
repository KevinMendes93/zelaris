import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../../shared/enums/role.enum';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import { PaginatedResponse } from '../../shared/dto/paginated-response.dto';
import { applyUserListFilters } from './user.filters';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.senha, 10);
    const newUser = this.userRepository.create({
      ...user,
      senha: hashedPassword,
      roles: user.roles ? user.roles : [Role.USER],
    });
    return this.userRepository.save(newUser);
  }

  async findAll(
    pageMeta: PageMeta,
    search?: string,
  ): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    applyUserListFilters(queryBuilder, {
      pageMeta,
      search,
    });

    const [items, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponse(items, pageMeta.page, pageMeta.limit, total);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { cpf } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { senha: hashedPassword });
  }
}
