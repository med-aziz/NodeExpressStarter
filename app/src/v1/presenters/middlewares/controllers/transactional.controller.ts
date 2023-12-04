import { dataSource } from '../../../data/connection';
import { Request, Response, NextFunction } from 'express';
import { DataSource, QueryRunner } from 'typeorm';

// ! DANGER: WHEN USING TRANSACTIONAL CONTROLLER DO NOT CATCH AN ERROR IN THE BASE CONTROLLER

// export const transactionalController =
//   (
//     fn: (
//       tx: Omit<
//         PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//         '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
//       >,
//     ) => (req: Request, res: Response, next: NextFunction) => Promise<any>,
//   ) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await dbConnection.$transaction(
//         async (
//           tx: Omit<
//             PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//             '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
//           >,
//         ) => {
//           const func = fn(tx);
//           await Promise.resolve(func(req, res, next));
//         },
//       );
//     } catch (err) {
//       next(err);
//     }
//   };
export const makeTransactionalController =
  (dbDataSource: DataSource) =>
  (fn: (tx: QueryRunner) => (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await dbDataSource.transaction(async (tx) => {
        const func = fn(tx.queryRunner);
        await Promise.resolve(func(req, res, next));
      });
    } catch (err) {
      next(err);
    }
  };
export const transactionalController =
  (fn: (tx: QueryRunner) => (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await dataSource.transaction(async (tx) => {
        const func = fn(tx.queryRunner);
        await Promise.resolve(func(req, res, next));
      });
    } catch (err) {
      next(err);
    }
  };
