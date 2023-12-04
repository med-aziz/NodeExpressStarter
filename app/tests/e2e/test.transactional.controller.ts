import { makeTransactionalController } from "app/src/v1/presenters/middlewares/controllers/transactional.controller";
import testDataSource from "./test.db.connection";

export const testTransactionalController = makeTransactionalController(testDataSource)