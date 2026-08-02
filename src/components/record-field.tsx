import { BilingualLabel } from "@/components/bilingual-label";
import { FIELD_LABELS, type FieldKey } from "@/data/identity";
import { cn } from "@/utils/misc";

type RecordFieldProps = {
  field: FieldKey;
  children: React.ReactNode;
  /** Current roles tint the label with the state accent. */
  isCurrent?: boolean;
};

/** The fixed label gutter is what aligns every value into one column, which is
 *  what makes the block read as a readout rather than a heading with subtext. */
export const RecordField = ({
  field,
  children,
  isCurrent,
}: RecordFieldProps) => (
  <div
    className={cn(
      "grid items-baseline gap-x-3",
      "grid-cols-[52px_1fr] sm:grid-cols-[88px_1fr]",
    )}
  >
    <dt>
      <BilingualLabel
        {...FIELD_LABELS[field]}
        tone={isCurrent ? "signal" : "default"}
      />
    </dt>

    {/* 13px, not 14: mono sets ~27% wider, so matching the prose size makes
        the table the loudest thing on the record. */}
    <dd className="font-mono text-[13px] text-neutral-200">{children}</dd>
  </div>
);
