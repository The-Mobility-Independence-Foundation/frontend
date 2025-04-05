export type InputInfo = {
    placeholder: string,
    type: string,
    minValue: string,
    maxValue: string,
    onValueChange: (values: Map<string, string>) => void;

}