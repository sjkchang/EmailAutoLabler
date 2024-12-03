import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rule } from '../schemas/rule.schema';
import { CreateRuleDto } from './dto/create-rule.dto';

@Injectable()
export class RuleService {
  constructor(@InjectModel(Rule.name) private ruleModel: Model<Rule>) {}

  async getMyRules(currentUserId: string): Promise<Rule[]> {
    return this.ruleModel.find({ user: currentUserId }).exec();
  }

  async createRule(
    currentUserId: string,
    createRuleDto: CreateRuleDto,
  ): Promise<Rule> {
    return this.ruleModel.create({ ...createRuleDto, user: currentUserId });
  }

  async createRules(
    currentUserId: string,
    createRuleDtos: CreateRuleDto[],
  ): Promise<Rule[]> {
    return this.ruleModel.create(
      createRuleDtos.map((ruleDto) => ({ ...ruleDto, user: currentUserId })),
    );
  }

  async deleteRule(currentUserId: string, ruleId: string): Promise<Rule> {
    return this.ruleModel.findOneAndDelete({
      _id: ruleId,
      user: currentUserId,
    });
  }
}
