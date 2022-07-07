import { Injectable } from "@nestjs/common";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { GraphQLEmailAddress, GraphQLJSON } from "graphql-scalars";
import { upperDirectiveTransformer } from "../directives/upper-case.directive";

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): ApolloDriverConfig {
    return {
      typePaths: ["./**/*.graphql"],
      transformSchema: (schema) => upperDirectiveTransformer(schema, "upper"),
      installSubscriptionHandlers: true,
      context: ({ req, res }) => ({
        req,
        res,
      }),
      resolvers: {
        JSON: GraphQLJSON,
        EMAIL: GraphQLEmailAddress
      },
    };
  }
}
