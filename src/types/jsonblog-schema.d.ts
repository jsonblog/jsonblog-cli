declare module 'jsonblog-schema' {
  interface ValidationResult {
    valid: boolean;
    error?: string;
  }

  interface BlogPost {
    title: string;
    description?: string;
    source?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface BlogPage {
    title: string;
    description?: string;
    source?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface BlogSite {
    title: string;
    description?: string;
  }

  interface BlogBasics {
    name: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
  }

  interface Blog {
    $schema?: string;
    site: BlogSite;
    basics: BlogBasics;
    posts: BlogPost[];
    pages?: BlogPage[];
  }

  interface Schema {
    validate: (
      blog: Blog,
      callback: (error: Error | null, result: ValidationResult | null) => void
    ) => void;
    example: Blog;
  }

  const schema: Schema;
  export = schema;
}
