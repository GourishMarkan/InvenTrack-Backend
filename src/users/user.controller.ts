import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput} from './dto/create-user.input'; // Rename your Input classes to DTO
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // Use a standard REST JWT Guard, not GqlAuthGuard
import { CurrentUser } from 'src/common/decorators/currentUser.decorator'; 
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserInput) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) 
  findOne(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserInput
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}