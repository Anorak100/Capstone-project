import prisma from "../Config/prisma.js";

const createHttpError = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

const getPagination = (page, limit) => ({
  page: Number.isInteger(page) && page > 0 ? page : 1,
  limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 20,
});

const paginationData = (page, limit, total) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
});

const publicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

const accountSelect = {
  id: true,
  accountNumber: true,
  accountType: true,
  balance: true,
  currency: true,
  status: true,
  createdAt: true,
};

const transactionIncludes = {
  sender: { select: { id: true, fullName: true, email: true, phone: true } },
  recipient: { select: { id: true, fullName: true, email: true, phone: true } },
  fromAccount: { select: { accountNumber: true, currency: true } },
  toAccount: { select: { accountNumber: true, currency: true } },
};

export const listUsers = async ({ page, limit, search }) => {
  const pagination = getPagination(page, limit);
  const normalizedSearch = search?.trim();
  const where = normalizedSearch
    ? {
        OR: [
          { firstName: { contains: normalizedSearch, mode: "insensitive" } },
          { lastName: { contains: normalizedSearch, mode: "insensitive" } },
          { fullName: { contains: normalizedSearch, mode: "insensitive" } },
          { email: { contains: normalizedSearch, mode: "insensitive" } },
          { phone: { contains: normalizedSearch } },
          { accounts: { some: { accountNumber: { contains: normalizedSearch } } } },
        ],
      }
    : {};

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        ...publicUserSelect,
        accounts: { select: accountSelect, orderBy: { createdAt: "asc" } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: paginationData(pagination.page, pagination.limit, total),
  };
};

export const getUserDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...publicUserSelect,
      accounts: { select: accountSelect, orderBy: { createdAt: "asc" } },
      sentTransactions: {
        take: 10,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: transactionIncludes,
      },
      receivedTransactions: {
        take: 10,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: transactionIncludes,
      },
    },
  });

  if (!user) throw createHttpError("User was not found", 404);
  return user;
};

export const updateUserStatus = async ({ userId, isActive, adminId }) => {
  return prisma.$transaction(async (transaction) => {
    const target = await transaction.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isActive: true },
    });
    if (!target) throw createHttpError("User was not found", 404);

    if (!isActive && target.id === adminId) {
      throw createHttpError("Administrators cannot deactivate their own account", 400);
    }

    if (!isActive && target.role === "ADMIN" && target.isActive) {
      const activeAdmins = await transaction.user.count({
        where: { role: "ADMIN", isActive: true },
      });
      if (activeAdmins <= 1) {
        throw createHttpError("The last active administrator cannot be deactivated", 409);
      }
    }

    const user = await transaction.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        ...publicUserSelect,
        accounts: { select: accountSelect, orderBy: { createdAt: "asc" } },
      },
    });

    const accountsUpdated = await transaction.account.updateMany({
      where: { userId, status: isActive ? "FROZEN" : "ACTIVE" },
      data: { status: isActive ? "ACTIVE" : "FROZEN" },
    });

    return {
      user,
      previousIsActive: target.isActive,
      isActive: user.isActive,
      accountsUpdated: accountsUpdated.count,
    };
  }, { isolationLevel: "Serializable" });
};

const buildTransactionWhere = ({ type, status, userId, reference, search, from, to }) => {
  const normalizedSearch = search?.trim() || reference?.trim();
  return {
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
    ...((from || to)
      ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
      : {}),
    AND: [
      ...(userId ? [{ OR: [{ senderId: userId }, { recipientId: userId }] }] : []),
      ...(normalizedSearch
        ? [{
            OR: [
              { reference: { contains: normalizedSearch, mode: "insensitive" } },
              { transferReference: { contains: normalizedSearch, mode: "insensitive" } },
              { sender: { fullName: { contains: normalizedSearch, mode: "insensitive" } } },
              { recipient: { fullName: { contains: normalizedSearch, mode: "insensitive" } } },
            ],
          }]
        : []),
    ],
  };
};

export const listTransactions = async (filters) => {
  const pagination = getPagination(filters.page, filters.limit);
  const where = buildTransactionWhere(filters);
  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      include: transactionIncludes,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, pagination: paginationData(pagination.page, pagination.limit, total) };
};

export const getTransactionByReference = async (reference) => {
  const transactions = await prisma.transaction.findMany({
    where: { OR: [{ reference }, { transferReference: reference }] },
    include: transactionIncludes,
    orderBy: [{ createdAt: "asc" }, { direction: "asc" }],
  });

  if (transactions.length === 0) {
    throw createHttpError("Transaction was not found", 404);
  }

  return { transactions };
};

export const getMetrics = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeUsers,
    totalAccounts,
    activeAccounts,
    currencies,
    totalTransactions,
    totalSuccessfulDebitVolume,
    todaySuccessfulDebitVolume,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.account.count(),
    prisma.account.count({ where: { status: "ACTIVE" } }),
    prisma.account.findMany({ distinct: ["currency"], select: { currency: true } }),
    prisma.transaction.count(),
    prisma.transaction.aggregate({
      where: { status: "SUCCESSFUL", direction: "DEBIT" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        status: "SUCCESSFUL",
        direction: "DEBIT",
        createdAt: { gte: startOfToday },
      },
      _sum: { amount: true },
    }),
  ]);

  const transferTotals = await Promise.all(currencies.map(async ({ currency }) => {
    const aggregate = await prisma.transaction.aggregate({
      where: {
        type: "TRANSFER",
        direction: "DEBIT",
        status: "SUCCESSFUL",
        fromAccount: { is: { currency } },
      },
      _sum: { amount: true },
      _count: { _all: true },
    });
    return {
      currency,
      successfulTransfers: aggregate._count._all,
      successfulTransferVolume: aggregate._sum.amount ?? "0.00",
    };
  }));

  return {
    users: { total: totalUsers, active: activeUsers },
    accounts: { total: totalAccounts, active: activeAccounts },
    transfers: transferTotals,
    transactions: { total: totalTransactions },
    volume: {
      processed: totalSuccessfulDebitVolume._sum.amount ?? "0.00",
      today: todaySuccessfulDebitVolume._sum.amount ?? "0.00",
    },
  };
};

export const listHighValueTransfers = async ({ minAmount, page, limit }) => {
  const pagination = getPagination(page, limit);
  const where = {
    type: "TRANSFER",
    direction: "DEBIT",
    status: "SUCCESSFUL",
    amount: { gte: minAmount },
  };
  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      include: transactionIncludes,
      orderBy: [{ amount: "desc" }, { createdAt: "desc" }],
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions: transactions.map((transaction) => ({
      ...transaction,
      riskReason: "AMOUNT_THRESHOLD",
    })),
    threshold: minAmount,
    pagination: paginationData(pagination.page, pagination.limit, total),
  };
};
