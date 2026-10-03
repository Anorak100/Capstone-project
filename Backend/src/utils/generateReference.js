import { randomUUID } from "node:crypto";

const generateReference = () => `TXN-${randomUUID()}`;

export default generateReference;