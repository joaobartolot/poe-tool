export type TradeInputs = {
	wantRatio: string;
	haveRatio: string;
	inventory: string;
};

export type TradeResult = {
	canTrade: boolean;
	receiveAmount: bigint;
	sellAmount: bigint;
	leftoverAmount: bigint;
	tradesCount: bigint;
	normalizedWant: bigint;
	normalizedHave: bigint;
	message?: string;
};

const DECIMAL_PATTERN = /^\d+(?:\.\d+)?$/;

const gcd = (a: bigint, b: bigint): bigint => {
	let x = a < 0n ? -a : a;
	let y = b < 0n ? -b : b;

	while (y !== 0n) {
		const temp = y;
		y = x % y;
		x = temp;
	}

	return x;
};

const parseDecimalToFraction = (
	value: string,
): { numerator: bigint; denominator: bigint } | null => {
	const normalized = value.trim();

	if (!DECIMAL_PATTERN.test(normalized)) {
		return null;
	}

	const [integerPart, decimalPart = ''] = normalized.split('.');
	const denominator = 10n ** BigInt(decimalPart.length);
	const numerator = BigInt(`${integerPart}${decimalPart}`);

	if (numerator === 0n || denominator === 0n) {
		return null;
	}

	const divisor = gcd(numerator, denominator);

	return {
		numerator: numerator / divisor,
		denominator: denominator / divisor,
	};
};

export const calculateTrade = ({
	wantRatio,
	haveRatio,
	inventory,
}: TradeInputs): TradeResult => {
	const wantFraction = parseDecimalToFraction(wantRatio);
	const haveFraction = parseDecimalToFraction(haveRatio);
	const inventoryFraction = parseDecimalToFraction(inventory);

	if (!wantFraction || !haveFraction || !inventoryFraction) {
		return {
			canTrade: false,
			receiveAmount: 0n,
			sellAmount: 0n,
			leftoverAmount: 0n,
			tradesCount: 0n,
			normalizedWant: 0n,
			normalizedHave: 0n,
			message: 'Enter valid positive numbers in all fields.',
		};
	}

	if (inventoryFraction.denominator !== 1n) {
		return {
			canTrade: false,
			receiveAmount: 0n,
			sellAmount: 0n,
			leftoverAmount: 0n,
			tradesCount: 0n,
			normalizedWant: 0n,
			normalizedHave: 0n,
			message: 'Inventory must be a whole number.',
		};
	}

	const rawWant = wantFraction.numerator * haveFraction.denominator;
	const rawHave = haveFraction.numerator * wantFraction.denominator;

	const ratioDivisor = gcd(rawWant, rawHave);
	const normalizedWant = rawWant / ratioDivisor;
	const normalizedHave = rawHave / ratioDivisor;
	const inventoryAmount = inventoryFraction.numerator;

	const tradesCount = inventoryAmount / normalizedHave;
	const sellAmount = tradesCount * normalizedHave;
	const receiveAmount = tradesCount * normalizedWant;
	const leftoverAmount = inventoryAmount - sellAmount;

	return {
		canTrade: tradesCount > 0n,
		receiveAmount,
		sellAmount,
		leftoverAmount,
		tradesCount,
		normalizedWant,
		normalizedHave,
		message:
			tradesCount > 0n
				? undefined
				: 'Not enough inventory for one valid trade.',
	};
};
