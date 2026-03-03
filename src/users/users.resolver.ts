import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GraphQLError } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    try {
      
      return this.usersService.create(createUserInput);
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

@Query(() => User)
@UseGuards(GqlAuthGuard)
  findOne(@CurrentUser() user:User ) {
    return this.usersService.findOne(user.id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
