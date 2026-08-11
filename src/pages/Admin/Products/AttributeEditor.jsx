import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import Input from "../../../components/forms/Input";
import Select from "../../../components/forms/Select";
import Button from "../../../components/ui/Button";
import { slugify } from "../../../lib/slugify";

const ATTRIBUTE_TYPES = [
  { value: "button", label: "Buttons (e.g. Size)" },
  { value: "color", label: "Color Swatches" },
];

/**
 * One attribute's editor: its name/type, plus a nested field array
 * of its options. Split out from AdminProductForm because a nested
 * useFieldArray needs its own component — you can't call it in a
 * loop inside the parent.
 */
function AttributeEditor({ control, register, watch, setValue, attrIndex, onRemove }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `attributes.${attrIndex}.options`,
  });

  const type = watch(`attributes.${attrIndex}.type`);

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-4">
      <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Input
          label="Attribute Name"
          placeholder="Size"
          {...register(`attributes.${attrIndex}.name`, { required: true })}
        />
        <Select
          label="Display As"
          options={ATTRIBUTE_TYPES}
          {...register(`attributes.${attrIndex}.type`)}
        />
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 size={14} className="text-[var(--danger)]" /> Remove
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {fields.map((field, optIndex) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label={optIndex === 0 ? "Option Label" : undefined}
                placeholder={type === "color" ? "Red" : "Small"}
                {...register(`attributes.${attrIndex}.options.${optIndex}.label`, {
                  required: true,
                  onChange: (e) =>
                    setValue(
                      `attributes.${attrIndex}.options.${optIndex}.value`,
                      slugify(e.target.value)
                    ),
                })}
              />
            </div>
            {type === "color" && (
              <div className="flex flex-col gap-1.5">
                {optIndex === 0 && (
                  <span
                    className="text-sm font-medium text-[var(--text)]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Swatch
                  </span>
                )}
                <input
                  type="color"
                  className="h-12 w-14 cursor-pointer rounded-[var(--radius-md)] border border-[var(--border)]"
                  {...register(`attributes.${attrIndex}.options.${optIndex}.swatch`)}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => remove(optIndex)}
              aria-label="Remove option"
              className="mb-1.5 shrink-0 text-[var(--text-light)] hover:text-[var(--danger)]"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-1 self-start"
          onClick={() =>
            append({ label: "", value: "", swatch: type === "color" ? "#000000" : undefined })
          }
        >
          <Plus size={14} /> Add Option
        </Button>
      </div>
    </div>
  );
}

export default AttributeEditor;
