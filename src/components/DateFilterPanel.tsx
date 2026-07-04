import { Checkbox } from './Checkbox';
import { CollapsibleSection } from './CollapsibleSection';
import {
  dateFilterForYear,
  getMonthLabels,
  isDateFilterRangeInvalid,
  type DateFilterState,
  type YearMonth,
} from '../utils/dateFilter';

interface DateFilterPanelProps {
  availableYears: number[];
  value: DateFilterState;
  onChange: (value: DateFilterState) => void;
  label?: string;
}

const selectClassName =
  'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-mid disabled:cursor-not-allowed disabled:opacity-50';

function YearMonthSelects({
  label,
  value,
  onChange,
  years,
  disabled,
}: {
  label: string;
  value: YearMonth;
  onChange: (ym: YearMonth) => void;
  years: number[];
  disabled?: boolean;
}) {
  const months = getMonthLabels();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-8 shrink-0 text-sm text-ink-muted">{label}</span>
      <select
        value={value.month}
        onChange={(e) => onChange({ ...value, month: Number(e.target.value) })}
        disabled={disabled}
        className={selectClassName}
        aria-label={`${label} mês`}
      >
        {months.map((name, index) => (
          <option key={name} value={index + 1}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={value.year}
        onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
        disabled={disabled}
        className={selectClassName}
        aria-label={`${label} ano`}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DateFilterPanel({
  availableYears,
  value,
  onChange,
  label = 'Filtrar por data',
}: DateFilterPanelProps) {
  const years =
    availableYears.length > 0 ? availableYears : [new Date().getFullYear()];
  const rangeInvalid = isDateFilterRangeInvalid(value);

  const handleYearShortcut = (year: number) => {
    const preset = dateFilterForYear(year);
    onChange({
      ...value,
      enabled: true,
      ...preset,
    });
  };

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <Checkbox
        checked={value.enabled}
        onChange={(enabled) => onChange({ ...value, enabled })}
        labelClassName="text-sm font-medium text-ink"
      >
        {label}
      </Checkbox>

      <CollapsibleSection open={value.enabled} className="mt-3">
        <div className="flex flex-col gap-3 pb-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <YearMonthSelects
              label="De"
              value={value.from}
              onChange={(from) => onChange({ ...value, from })}
              years={years}
            />

            <YearMonthSelects
              label="Até"
              value={value.to}
              onChange={(to) => onChange({ ...value, to, untilPresent: false })}
              years={years}
              disabled={value.untilPresent}
            />

            <Checkbox
              checked={value.untilPresent}
              onChange={(untilPresent) => onChange({ ...value, untilPresent })}
              labelClassName="text-sm text-ink-muted"
            >
              Até hoje
            </Checkbox>
          </div>

          {availableYears.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-muted">Atalhos:</span>
              {availableYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearShortcut(year)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-ink transition-colors hover:border-brand-mid hover:text-brand-mid"
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {rangeInvalid && (
            <p className="text-xs text-brand-mid">
              O mês/ano inicial não pode ser posterior ao final. Ajuste o intervalo para aplicar o
              filtro.
            </p>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}
