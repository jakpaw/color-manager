import { ApolloServer } from 'apollo-server-micro';
import { NextApiHandler } from 'next';
import { idArg, makeSchema, nonNull, objectType, stringArg } from 'nexus';
import path from 'path';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import prisma from '../../lib/prisma';
import { isValidColorHex } from '../../shared/validation';

const Color = objectType({
  name: 'Color',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.nonNull.string('value');
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('colors', {
      type: 'Color',
      resolve: (_parent, _args) => {
        return prisma.color.findMany();
      },
    });
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('createColor', {
      type: 'Color',
      args: {
        name: nonNull(stringArg()),
        value: nonNull(stringArg()),
      },
      resolve: (_, { name, value }) => {
        if (!isValidColorHex(value)) {
          throw new Error('Color needs to be in hex format');
        }
        return prisma.color.create({
          data: {
            name,
            value,
          },
        });
      },
    });

    t.nonNull.field('deleteColor', {
      type: 'Color',
      args: {
        colorId: nonNull(idArg()),
      },
      resolve: (_, { colorId }) => {
        return prisma.color.delete({
          where: { id: colorId },
        });
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Color],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

let apolloServerHandler: NextApiHandler;

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    await apolloServer.start();

    apolloServerHandler = apolloServer.createHandler({
      path: '/api',
    });
  }

  return apolloServerHandler;
}

const handler: NextApiHandler = async (req, res) => {
  const apolloServerHandler = await getApolloServerHandler();

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  return apolloServerHandler(req, res);
};

export default handler;
