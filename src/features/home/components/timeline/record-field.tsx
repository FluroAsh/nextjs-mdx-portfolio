import { cn } from "@/utils/misc";

/**
 * Field keys, bilingual to match the labelling the design already establishes.
 * The organisation deliberately has no entry: it is the record's identity and
 * leads the entry as a heading, not one of its values.
 *
 * Below `sm` the *Chinese* is dropped, not the English. English is the
 * functional label and Chinese is the flavour — hiding the functional half on
 * the viewport where an aligned label/value layout is hardest to parse would
 * leave most visitors with pure ornament.
 */
export const FIELD_LABELS = {
  role: { zh: "職務", en: "ROLE" },
  period: { zh: "期間", en: "PERIOD" },
  location: { zh: "地點", en: "LOC" },
} as const;

export type FieldKey = keyof typeof FIELD_LABELS;

type RecordFieldProps = {
  field: FieldKey;
  children: React.ReactNode;
  /** Current roles tint the label with the state accent. */
  isCurrent?: boolean;
};

/**
 * One labelled row of a record. Label sits in a fixed gutter so every value in
 * the entry aligns to a shared column — that alignment is what makes the block
 * read as a readout rather than as a heading with subtext.
 *
 * A bilingual label is one object, so both halves stay in one hue and follow
 * the record's state together. Hierarchy inside that object comes from two
 * steps of the ramp rather than from size: the type is already at 10px, where
 * a size change either fails to register or forces the column wider.
 *
 * Steps, not opacity. Fading toward the background darkens *and* desaturates,
 * which is what made the earlier `/50` read as a muddy grey-green at 2.9:1.
 * Distinct shades hold saturation, so the dim half still reads as the system
 * hue: 11.1:1 and 6.2:1 here, both clear of the 4.5 floor.
 */
export const RecordField = ({
  field,
  children,
  isCurrent,
}: RecordFieldProps) => {
  const label = FIELD_LABELS[field];

  return (
    <div className="grid grid-cols-[3.25rem_1fr] items-baseline gap-x-3 sm:grid-cols-[5.5rem_1fr]">
      <dt className="font-mono text-[10px] tracking-wider">
        <span
          className={cn(
            "hidden sm:inline",
            isCurrent ? "text-signal" : "text-green-400",
          )}
        >
          {label.zh}
        </span>

        <span
          className={cn(
            "sm:ml-1.5",
            isCurrent ? "text-signal-dim" : "text-green-600",
          )}
        >
          {label.en}
        </span>
      </dt>

      {/* A step below the prose beside it: mono sets ~27% wider than the
          grotesque at the same nominal size, so matching sizes made the field
          table read as the largest thing in the record. Dropping one step
          closes the optical gap while keeping the table denser than the prose,
          which is the hierarchy we want. */}
      <dd className="font-mono text-[13px] text-neutral-200">{children}</dd>
    </div>
  );
};
