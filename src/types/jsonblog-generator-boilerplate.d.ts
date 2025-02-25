declare module 'jsonblog-generator-boilerplate' {
  interface BlogFile {
    name: string;
    content: string;
  }

  interface Generator {
    (blog: any): Promise<BlogFile[]>;
  }

  const generator: Generator;
  export = generator;
}
