import { FIELD_LABELS, type FieldKey } from "@/data/identity";
import { cn } from "@/utils/misc";

import { BilingualLabel } from "../bilingual-label";

type RecordFieldProps = {
  field: FieldKey;
  children: React.ReactNode;
  /** Current roles tint the label with the state accent. */
  isCurrent?: boolean;
};

/**
 * One labelled row of a record. The label sits in a fixed gutter so every value
 * lines up in a shared column, which is what makes the block read as a readout
 * rather than a heading with subtext.
 */
export const RecordField = ({
  field,
  children,
  isCurrent,
}: RecordFieldProps) => (
  <div
    className={cn(
      "grid items-baseline gap-x-3",
      "grid-cols-[3.25rem_1fr] sm:grid-cols-[5.5rem_1fr]",
    )}
  >
    <dt>
      <BilingualLabel
        {...FIELD_LABELS[field]}
        tone={isCurrent ? "signal" : "default"}
      />
    </dt>

    {/* One step below the prose beside it: mono sets ~27% wider at the same
        nominal size, so matching sizes made the table the loudest thing here. */}
    <dd className="font-mono text-[13px] text-neutral-200">{children}</dd>
  </div>
);
