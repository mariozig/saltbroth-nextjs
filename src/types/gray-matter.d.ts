/**
 * TypeScript declarations for gray-matter
 */

declare module 'gray-matter' {
  interface GrayMatterFile<T = Record<string, unknown>> {
    data: T;
    content: string;
    excerpt?: string;
    orig: Buffer | string;
    language?: string;
    matter?: string;
    stringify?: (file: GrayMatterFile<T>) => string;
  }

  interface Options {
    excerpt?: boolean | ((input: string, options: Options) => string);
    excerpt_separator?: string;
    engines?: Record<string, unknown>;
    language?: string;
    delimiters?: string | [string, string];
    engines?: Record<string, unknown>;
    parser?: (input: string, options: Options) => Record<string, unknown>;
  }

  interface MatterFn {
    (input: string | Buffer, options?: Options): GrayMatterFile;
    read(filepath: string, options?: Options): GrayMatterFile;
    stringify(file: string | GrayMatterFile, options?: Options): string;
    test(input: string | Buffer, options?: Options): boolean;
  }

  const matter: MatterFn;
  export = matter;
}
