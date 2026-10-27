export interface BaseFieldProps {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
  readonly hint?: string;
  readonly autoComplete?: string;
}

export interface Option {
  readonly value: string;
  readonly label: string;
}
