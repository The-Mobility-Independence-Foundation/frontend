import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MultiRadioButtonProps {
  title: string,
  labels: string[],
  onValueChange: (value: string) => void
}

export default function MultiRadioButton({title, labels, onValueChange}: MultiRadioButtonProps) {
  return <>
  <h1 className="font-sans font-semibold text-2xl mb-2">
      {title}
  </h1>
  <div className="flex mb-6">
    <RadioGroup onValueChange={onValueChange}>
      {labels.map((label, i) => (
        <div className="flex items-center space-x-2" key={label}>
          <RadioGroupItem value={label} id={`${i}`} />
          <Label htmlFor={`${i}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  </div>
</>
}