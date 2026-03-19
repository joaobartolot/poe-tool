import {
	useEffect,
	useMemo,
	useState,
	type ChangeEventHandler,
	type KeyboardEventHandler,
} from 'react';
import { NumberField } from './NumberField';
import { calculateTrade } from '../utils/tradeMath';

const INITIAL_VALUES = {
	wantRatio: '1.5',
	haveRatio: '1',
	inventory: '3',
};

const SwapIcon = () => (
	<svg
		aria-hidden="true"
		viewBox="0 0 24 24"
		className="h-5 w-5"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.75"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M7 7h11" />
		<path d="m14 4 4 3-4 3" />
		<path d="M17 17H6" />
		<path d="m10 14-4 3 4 3" />
	</svg>
);

export const TradeCalculator = () => {
	const [wantRatio, setWantRatio] = useState(INITIAL_VALUES.wantRatio);
	const [haveRatio, setHaveRatio] = useState(INITIAL_VALUES.haveRatio);
	const [inventory, setInventory] = useState(INITIAL_VALUES.inventory);
	const [shouldAutoCopy, setShouldAutoCopy] = useState(false);
	const [copyStatus, setCopyStatus] = useState('');

	const result = useMemo(
		() => calculateTrade({ wantRatio, haveRatio, inventory }),
		[wantRatio, haveRatio, inventory],
	);

	const copyToClipboard = async (
		value: string,
		label: 'I want' | 'I have',
	) => {
		if (!result.canTrade) {
			setCopyStatus('Enter a valid trade before copying.');
			return;
		}

		if (!navigator.clipboard?.writeText) {
			setCopyStatus('Clipboard access is not available on this device.');
			return;
		}

		try {
			await navigator.clipboard.writeText(value);
			setCopyStatus(`Copied ${label}: ${value}`);
		} catch {
			setCopyStatus('Clipboard permission was blocked.');
		}
	};

	const copyReceiveAmount = async () => {
		await copyToClipboard(result.receiveAmount.toString(), 'I want');
	};

	useEffect(() => {
		if (
			!shouldAutoCopy ||
			!result.canTrade ||
			!navigator.clipboard?.writeText
		) {
			return;
		}

		void navigator.clipboard.writeText(result.receiveAmount.toString());
	}, [result.canTrade, result.receiveAmount, shouldAutoCopy]);

	const handleChange =
		(
			setter: (value: string) => void,
		): ChangeEventHandler<HTMLInputElement> =>
		(event) => {
			setter(event.target.value);
			setCopyStatus('');
		};

	const handleSwapRatios = () => {
		setWantRatio(haveRatio);
		setHaveRatio(wantRatio);
		setCopyStatus('');
	};

	const handleEnterKey = (
		nextFieldId?: string,
	): KeyboardEventHandler<HTMLInputElement> => {
		return (event) => {
			if (event.key !== 'Enter') {
				return;
			}

			event.preventDefault();

			const nextInput = nextFieldId
				? document.getElementById(nextFieldId)
				: null;

			if (nextInput instanceof HTMLInputElement) {
				nextInput.focus();
				nextInput.select();
				return;
			}

			if (!shouldAutoCopy) {
				void copyReceiveAmount();
			}
		};
	};

	return (
		<section className="space-y-6 rounded-2xl border border-palette-border bg-palette-surfaceElevated p-5 shadow-card sm:p-6">
			<header>
				<h2 className="text-xl font-semibold text-palette-textStrong">
					Faustus trade helper
				</h2>
			</header>

			<div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3">
				<NumberField
					id="wantRatio"
					label="I want (ratio)"
					value={wantRatio}
					onChange={handleChange(setWantRatio)}
					placeholder="1"
					onKeyDown={handleEnterKey('haveRatio')}
					enterKeyHint="next"
				/>
				<button
					type="button"
					onClick={handleSwapRatios}
					aria-label="Swap I want and I have ratios"
					className="mb-[0.125rem] inline-flex h-12 w-12 items-center justify-center rounded-xl border border-palette-border bg-palette-surface text-palette-textStrong shadow-sm transition hover:border-palette-brand hover:text-palette-brand focus:outline-none focus:ring-2 focus:ring-palette-brand/20"
				>
					<SwapIcon />
				</button>
				<NumberField
					id="haveRatio"
					label="I have (ratio)"
					value={haveRatio}
					onChange={handleChange(setHaveRatio)}
					placeholder="1"
					onKeyDown={handleEnterKey('inventory')}
					enterKeyHint="next"
				/>
			</div>

			<NumberField
				id="inventory"
				label="Inventory available"
				value={inventory}
				onChange={handleChange(setInventory)}
				placeholder="673"
				onKeyDown={handleEnterKey()}
				enterKeyHint={shouldAutoCopy ? 'done' : 'go'}
			/>

			<label className="flex items-start gap-3 rounded-xl border border-palette-border bg-palette-surface p-4 text-sm text-palette-textStrong">
				<input
					type="checkbox"
					checked={shouldAutoCopy}
					onChange={(event) =>
						setShouldAutoCopy(event.target.checked)
					}
					className="mt-0.5 h-4 w-4 rounded border-palette-border text-palette-brand focus:ring-palette-brand"
				/>
				<span className="space-y-1">
					<span className="block font-medium">
						Always copy “I want”
					</span>
					<span className="block text-xs text-palette-textMuted">
						Copies the whole-number “I want” result to your
						clipboard as you type.
					</span>
				</span>
			</label>

			<div className="rounded-xl border border-palette-border bg-palette-surface p-4">
				<div className="grid grid-cols-2 gap-3 text-center">
					<button
						type="button"
						onClick={() =>
							void copyToClipboard(
								result.receiveAmount.toString(),
								'I want',
							)
						}
						className="rounded-lg bg-palette-bg p-3 transition hover:border-palette-brand hover:bg-palette-surface focus:outline-none focus:ring-2 focus:ring-palette-brand/20"
					>
						<p className="text-xs text-palette-textMuted">I want</p>
						<p className="text-2xl font-semibold text-palette-textStrong">
							{result.receiveAmount.toString()}
						</p>
						<p className="mt-2 text-xs text-palette-textMuted">
							Click to copy
						</p>
					</button>
					<button
						type="button"
						onClick={() =>
							void copyToClipboard(
								result.sellAmount.toString(),
								'I have',
							)
						}
						className="rounded-lg bg-palette-bg p-3 transition hover:border-palette-brand hover:bg-palette-surface focus:outline-none focus:ring-2 focus:ring-palette-brand/20"
					>
						<p className="text-xs text-palette-textMuted">I have</p>
						<p className="text-2xl font-semibold text-palette-textStrong">
							{result.sellAmount.toString()}
						</p>
						<p className="mt-2 text-xs text-palette-textMuted">
							Click to copy
						</p>
					</button>
				</div>

				<div className="mt-4 space-y-1 text-sm text-palette-textMuted">
					<p>
						Normalized ratio: {result.normalizedWant.toString()} :{' '}
						{result.normalizedHave.toString()}
					</p>
					<p>
						Leftover inventory: {result.leftoverAmount.toString()}
					</p>
					{result.message ? (
						<p className="font-medium text-palette-warning">
							{result.message}
						</p>
					) : null}
					{copyStatus ? (
						<p className="font-medium text-palette-brand">
							{copyStatus}
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
};
