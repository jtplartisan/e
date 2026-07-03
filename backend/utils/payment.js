const createPayment = async (amount) => {
  return {
    success: true,
    amount,
    transactionId: `TXN_${Date.now()}`,
  };
};

module.exports = { createPayment };