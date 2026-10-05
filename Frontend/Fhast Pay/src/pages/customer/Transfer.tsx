import { useEffect, useState } from "react";
import {
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiUserCheck,
  FiArrowRight,
  FiRefreshCw,
  FiDollarSign,
} from "react-icons/fi";
import {
  getBalance,
  lookupRecipient,
  type Account,
  type Recipient,
} from "../../services/accountService";
import { makeTransfer, type TransferData } from "../../services/transactionService";
import styles from "./Transfer.module.css";

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

function Transfer() {
  const [account, setAccount] = useState<Account | null>(null);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<TransferData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You are not signed in.");
        setIsLoading(false);
        return;
      }

      try {
        const accounts = await getBalance(token);
        setAccount(accounts[0] ?? null);

        if (!accounts[0]) {
          setError("No active account was found.");
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your account",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAccount();
  }, []);

  const handleRecipientLookup = async (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    const accountNumber = event.currentTarget.value.trim();

    setRecipient(null);
    setError("");

    if (!accountNumber) {
      return;
    }

    if (account && accountNumber === account.accountNumber) {
      setError("You cannot transfer money to your own account.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You are not signed in.");
      return;
    }

    setIsLookingUp(true);

    try {
      const result = await lookupRecipient(token, accountNumber);
      setRecipient(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to find recipient account",
      );
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You are not signed in.");
      return;
    }

    if (!account) {
      setError("Your account could not be found.");
      return;
    }

    if (!recipient) {
      setError("Please verify the recipient account first.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount to transfer.");
      return;
    }

    if (numAmount > Number(account.balance)) {
      setError("Insufficient balance for this transfer.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await makeTransfer(token, {
        fromAccount: account.accountNumber,
        toAccount: recipient.accountNumber,
        amount,
        description: description.trim() || undefined,
      });

      setSuccessData(result);
      // Refresh balance
      const updatedAccounts = await getBalance(token).catch(() => []);
      if (updatedAccounts[0]) setAccount(updatedAccounts[0]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to complete the transfer",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setRecipient(null);
    setAmount("");
    setDescription("");
    setError("");
  };

  return (
    <main className={styles.transfer}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTag}>Instant Transfer</div>
          <h1>Send Money</h1>
          <p>Transfer funds securely to any Fhast Pay account.</p>
        </header>

        {/* BALANCE BANNER */}
        {account && (
          <div className={styles.balanceBanner}>
            <div className={styles.balanceInfo}>
              <span className={styles.bannerLabel}>Transfer From</span>
              <strong className={styles.bannerAccount}>
                Account {account.accountNumber}
              </strong>
            </div>
            <div className={styles.bannerAmount}>
              <span className={styles.bannerLabel}>Available Balance</span>
              <strong>
                {account.currency}{" "}
                {Number(account.balance).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>
        )}

        <section className={styles.card}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <FiRefreshCw className={styles.spinner} />
              <p>Loading your account details...</p>
            </div>
          ) : successData ? (
            /* SUCCESS RECEIPT */
            <div className={styles.receipt}>
              <div className={styles.receiptSuccessIcon}>
                <FiCheckCircle />
              </div>
              <h2>Transfer Successful!</h2>
              <p className={styles.receiptSubtitle}>
                Your money has been securely transferred.
              </p>

              <div className={styles.receiptDetails}>
                <div className={styles.receiptRow}>
                  <span>Amount Sent</span>
                  <strong className={styles.receiptAmount}>
                    {successData.currency}{" "}
                    {Number(successData.amount).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Recipient</span>
                  <strong>{recipient?.accountName ?? "Customer"}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>To Account</span>
                  <strong>{recipient?.accountNumber}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Reference ID</span>
                  <strong className={styles.referenceId}>
                    {successData.reference}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
              >
                Send Another Transfer
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* RECIPIENT ACCOUNT INPUT */}
              <div className={styles.formGroup}>
                <label htmlFor="accountNumber">Recipient Account Number</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    placeholder="Enter 10-digit account number"
                    onBlur={handleRecipientLookup}
                    required
                    className={styles.textInput}
                  />
                  {isLookingUp && (
                    <div className={styles.lookupLoader}>
                      <FiRefreshCw className={styles.spinner} />
                    </div>
                  )}
                </div>
              </div>

              {/* VERIFIED RECIPIENT CARD */}
              {recipient && (
                <div className={styles.recipientCard}>
                  <div className={styles.recipientAvatar}>
                    <FiUserCheck />
                  </div>
                  <div className={styles.recipientInfo}>
                    <div className={styles.recipientNameRow}>
                      <strong>{recipient.accountName}</strong>
                      <span className={styles.verifiedBadge}>Verified</span>
                    </div>
                    <p>
                      {recipient.accountNumber} · {recipient.currency} Account
                    </p>
                  </div>
                </div>
              )}

              {/* AMOUNT INPUT & QUICK SELECT */}
              <div className={styles.formGroup}>
                <label htmlFor="amount">
                  Amount ({account?.currency ?? "NGN"})
                </label>
                <div className={styles.amountInputWrapper}>
                  <span className={styles.currencyPrefix}>
                    <FiDollarSign />
                  </span>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className={styles.amountInput}
                  />
                </div>

                {/* QUICK CHIPS */}
                <div className={styles.quickChips}>
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={styles.quickChip}
                      onClick={() => setAmount(String(amt))}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className={styles.formGroup}>
                <label htmlFor="description">
                  Note / Description <span>(optional)</span>
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="e.g. Lunch with friends, Rent, Utilities"
                  maxLength={100}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textInput}
                />
              </div>

              {error && (
                <div className={styles.errorAlert} role="alert">
                  <FiAlertCircle />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !recipient || !amount}
              >
                {isSubmitting ? (
                  <>
                    <FiRefreshCw className={styles.spinner} /> Processing...
                  </>
                ) : (
                  <>
                    Transfer Now <FiArrowRight />
                  </>
                )}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default Transfer;
