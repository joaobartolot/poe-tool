import type { ChangeEventHandler, KeyboardEventHandler } from 'react';

type NumberFieldProps = {
	id: string;
	label: string;
	value: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	placeholder?: string;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	enterKeyHint?:
		| 'done'
		| 'enter'
		| 'go'
		| 'next'
		| 'previous'
		| 'search'
		| 'send';
};

export const NumberField = ({
	id,
	label,
	value,
	onChange,
	placeholder,
	onKeyDown,
	enterKeyHint,
}: NumberFieldProps) => {
	return (
		<div className="space-y-2">
			<label
				htmlFor={id}
				className="block text-sm font-medium text-palette-textStrong"
			>
				{label}
			</label>
			<input
				id={id}
				type="number"
				inputMode="decimal"
				min="0"
				step="any"
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				enterKeyHint={enterKeyHint}
				placeholder={placeholder}
				className="w-full rounded-xl border border-palette-border bg-palette-surface px-4 py-3 text-base text-palette-textStrong shadow-sm outline-none transition focus:border-palette-brand focus:ring-2 focus:ring-palette-brand/20"
			/>
		</div>
	);
};
