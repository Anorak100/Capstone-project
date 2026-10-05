import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import {
  getBalance,
  lookupRecipient,
  type Account,
  type Recipient,
} from "../../services/accountService";
import { makeTransfer } from "../../services/transactionService";
import styles from "./Transfer.module.css";

function Transfer() {
  const [account, setAccount] = useState<Account | null>(null);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

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

    const formData = new FormData(event.currentTarget);

    const amount = String(formData.get("amount") ?? "").trim();

    const description = String(formData.get("description") ?? "").trim();

    setIsSubmitting(true);

    try {
      const result = await makeTransfer(token, {
        fromAccount: account.accountNumber,
        toAccount: recipient.accountNumber,
        amount,
        description: description || undefined,
      });

      setSuccess(`Transfer successful. Reference: ${result.reference}`);

      setRecipient(null);
      event.currentTarget.reset();
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

  return (
    <main className={styles.transfer}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Transfer Money</h1>
          <p>Send money securely to another account.</p>
        </header>

        <section className={styles.card}>
          {isLoading ? (
            <p>Loading your account...</p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                id="accountNumber"
                name="accountNumber"
                label="Recipient account number"
                type="text"
                placeholder="Enter account number"
                onBlur={handleRecipientLookup}
                required
              />

              {isLookingUp && <p>Checking recipient account...</p>}

              {recipient && (
                <div>
                  <strong>{recipient.accountName}</strong>
                  <p>
                    {recipient.accountNumber} · {recipient.currency}
                  </p>
                </div>
              )}

              <Input
                id="amount"
                name="amount"
                label={`Amount (${account?.currency ?? "NGN"})`}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter amount"
                required
              />

              <div className={styles.formGroup}>
                <label htmlFor="description">
                  Description <span>(optional)</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="What is this transfer for?"
                  rows={4}
                  maxLength={250}
                />
              </div>

              {error && <p role="alert">{error}</p>}

              {success && <p role="status">{success}</p>}

              <Button type="submit" disabled={isSubmitting || !recipient}>
                {isSubmitting ? "Processing..." : "Continue"}
              </Button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default Transfer;
