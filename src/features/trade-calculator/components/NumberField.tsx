import type { ChangeEventHandler } from 'react';

type NumberFieldProps = {
	id: string;
	label: string;
	value: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	helpText?: string;
	placeholder?: string;
};

export const NumberField = ({
	id,
	label,
	value,
	onChange,
	helpText,
	placeholder,
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
				placeholder={placeholder}
				className="w-full rounded-xl border border-palette-border bg-palette-surface px-4 py-3 text-base text-palette-textStrong shadow-sm outline-none transition focus:border-palette-brand focus:ring-2 focus:ring-palette-brand/20"
			/>
			{helpText ? (
				<p className="text-xs text-palette-textMuted">{helpText}</p>
			) : null}
		</div>
	);
};
