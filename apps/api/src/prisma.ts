// Use the locally generated Prisma client to ensure schema changes are available
import { PrismaClient } from "../generated/prisma";


const prisma = new PrismaClient();

export default prisma;