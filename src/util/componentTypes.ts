export interface WithLoading {
  loading: boolean,
}

export interface WithScanner {
  scanner: boolean,
}

export interface WithEditing {
  editing: boolean
}

export interface CodeResult {
  codeResult: {
    code: string
  };
}
