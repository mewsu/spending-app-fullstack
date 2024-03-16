const router = require("express").Router();

const Transaction = require("../db/models/transaction");
const Conversion = require("../db/models/conversion");
const { DAILY, resolveDateRange, formatISODateByFrame } = require("../utils/helpers");

const methodNotAllowed = (req, res, next) => {
  return res.header("Allow", "GET").sendStatus(405);
};

const getSpending = async (req, res, next) => {
  const { query } = req;
  const range = query.range ?? 6;
  const frame = query.frame ?? DAILY;
  const currency = query.currency ?? "CAD";

  /*
   * Run `npm run seed` to refresh your database with transactions closer to-date
   */
  const { from, to } = resolveDateRange(frame, range);
  const transactions = await Transaction.getTransactionsForRange(from, to);
  const totalAmountMap = {};

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const dateKey = formatISODateByFrame(date, frame);
    let amount = transaction.amount;
    if (currency !== transaction.currency) {
      const exchangeRange = await Conversion.findExchangeRate(transaction.currency, currency);
      amount *= exchangeRange.rate;
    }

    if (totalAmountMap.hasOwnProperty(dateKey)) {
      totalAmountMap[dateKey] += amount;
    } else {
      totalAmountMap[dateKey] = amount;
    }
  }

  const formattedSpendingData = Object.entries(totalAmountMap).map(([startDate, totalAmount]) => ({
    startDate,
    totalAmount: +totalAmount.toFixed(2),
  }));

  const data = {
    spendings: formattedSpendingData.sort(function (a, b) {
      return new Date(a.startDate) - new Date(b.startDate);
    }),
  };

  return res.json(data);
};

router.route("/").get(getSpending).all(methodNotAllowed);

module.exports = router;
