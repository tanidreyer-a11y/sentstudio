import { Store, Car, Truck, MapPin } from "lucide-react";

export type DeliveryOption = "pickup" | "uber" | "aramex";

export interface DeliveryDetails {
  option: DeliveryOption;
  fullName: string;
  phone: string;
  streetAddress: string;
  cityArea: string;
  postalCode: string;
  instructions: string;
}

interface DeliveryFormProps {
  details: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
}

const ARAMEX_FEE = 99;

const deliveryOptions: {
  value: DeliveryOption;
  icon: typeof Store;
  title: string;
  description: string;
  extra: string;
}[] = [
  {
    value: "pickup",
    icon: Store,
    title: "Store Pickup",
    description: "Collect at Flora Shopping Centre, Roodepoort",
    extra: "Free",
  },
  {
    value: "uber",
    icon: Car,
    title: "Uber / Bolt",
    description: "Order your own ride from Flora Centre",
    extra: "You arrange",
  },
  {
    value: "aramex",
    icon: Truck,
    title: "Aramex Courier",
    description: "Nationwide via Pick n Pay drop-off",
    extra: `+ R${ARAMEX_FEE}`,
  },
];

const needsAddress = (option: DeliveryOption) => option === "aramex";

const DeliveryForm = ({ details, onChange }: DeliveryFormProps) => {
  const update = (partial: Partial<DeliveryDetails>) =>
    onChange({ ...details, ...partial });

  return (
    <div className="space-y-6">
      {/* Delivery method selector */}
      <div>
        <label className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
          Delivery Method
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {deliveryOptions.map((opt) => {
            const Icon = opt.icon;
            const selected = details.option === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ option: opt.value })}
                className={`p-4 border text-left transition-colors ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Icon size={20} className="text-primary mb-2" />
                <p className="font-sans text-sm font-medium text-foreground">
                  {opt.title}
                </p>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  {opt.description}
                </p>
                <p className="font-sans text-xs text-primary mt-1 font-medium">
                  {opt.extra}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Full Name"
          value={details.fullName}
          onChange={(v) => update({ fullName: v })}
          placeholder="John Smith"
          required
        />
        <Field
          label="Phone Number"
          value={details.phone}
          onChange={(v) => update({ phone: v })}
          placeholder="082 xxx xxxx"
          type="tel"
          required
        />
      </div>

      {needsAddress(details.option) && (
        <div className="space-y-4">
          <Field
            label="Street Address"
            value={details.streetAddress}
            onChange={(v) => update({ streetAddress: v })}
            placeholder="12 Main Road"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="City / Area"
              value={details.cityArea}
              onChange={(v) => update({ cityArea: v })}
              placeholder="Johannesburg"
              required
            />
            <Field
              label="Postal Code"
              value={details.postalCode}
              onChange={(v) => update({ postalCode: v })}
              placeholder="2001"
              required
            />
          </div>
        </div>
      )}

      <Field
        label="Special Delivery Instructions"
        value={details.instructions}
        onChange={(v) => update({ instructions: v })}
        placeholder="Leave at reception, ring bell, etc."
        optional
      />
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
}) => (
  <div>
    <label className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-2">
      {label}
      {optional && (
        <span className="normal-case tracking-normal text-muted-foreground/50 ml-2">
          (optional)
        </span>
      )}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-6 py-4 bg-card border border-border font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
    />
  </div>
);

export { ARAMEX_FEE };
export default DeliveryForm;
