import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../shared/enums/role.enum';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { UserService } from './user.service';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { CurrentUser } from '../../shared/utils/decorators/current-user.decorator';
import { Roles } from '../../shared/utils/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    const response = plainToInstance(UserResponseDto, user);
    return ApiResponse.success(
      'Dados do usuário obtidos com sucesso',
      response,
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: PaginationQueryDto) {
    const pageMeta = query.toPageMeta();

    const paginatedResult = await this.userService.findAll(
      pageMeta,
      query.search,
    );

    const response = {
      items: plainToInstance(UserResponseDto, paginatedResult.items),
      meta: paginatedResult.meta,
    };
    return ApiResponse.success('Usuários obtidos com sucesso', response);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: number) {
    const user = await this.userService.findById(+id);
    const response = plainToInstance(UserResponseDto, user);
    return ApiResponse.success('Usuário obtido com sucesso', response);
  }
}
