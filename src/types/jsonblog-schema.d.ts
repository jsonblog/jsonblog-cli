declare module 'jsonblog-schema' {
  interface ValidationResult {
    valid: boolean;
  }

  interface Schema {
    validate: (
      blog: any,
      callback: (error: Error | null, result: ValidationResult | null) => void
    ) => void;
    example: any;
  }

  const schema: Schema;
  export = schema;
}
