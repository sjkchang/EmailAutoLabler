import { Controller, Delete, Get, Post, Body, Param } from '@nestjs/common';
import { CurrentUser } from '../user/user.decorator';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateRuleDto } from './dto/create-rule.dto';

@Controller('rule')
export class RuleController {
  @Get()
  getMyRules(@CurrentUser() user: UserDocument) {
    return { user };
  }

  @Post()
  createRule(
    @CurrentUser() user: UserDocument,
    @Body() createRuleDto: CreateRuleDto,
  ) {
    return { user, createRuleDto };
  }

  @Post()
  createRules(
    @CurrentUser() user: UserDocument,
    @Body() createRuleDto: CreateRuleDto[],
  ) {
    return { user, createRuleDto };
  }

  @Delete(':ruleId')
  deleteRule(@CurrentUser() user: UserDocument, @Param('ruleId') id: string) {
    return { user, id };
  }
}
