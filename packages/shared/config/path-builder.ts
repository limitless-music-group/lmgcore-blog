//packages/shared/config/path-builder.ts

type Environment = "development" | "production";

interface BaseUrlConfig {
  development: string;
  production: string;
}

interface RouteTree {
  // biome-ignore lint/suspicious/noExplicitAny: needed for contravariant param positions
  [key: string]: ((...args: any[]) => string) | RouteTree;
}

// biome-ignore lint/suspicious/noExplicitAny: any[] required — RouteFn<readonly unknown[]> fails contra-variance for typed params like (id: string) => string
type BuiltRoute<T> = T extends (...args: any[]) => string
  ? {
      getUrl: (...args: Parameters<T>) => string;
    }
  : {
      [K in keyof T]: BuiltRoute<T[K]>;
    };

const getEnvironment = (): Environment =>
  process.env.NODE_ENV === "production" ? "production" : "development";

export const createBaseUrl = (config: BaseUrlConfig): string =>
  config[getEnvironment()];

const buildNode = <T>(node: T, baseUrl: string): BuiltRoute<T> => {
  if (typeof node === "function") {
    // biome-ignore lint/suspicious/noExplicitAny: function params
    const fn = node as (...args: any[]) => string;
    return {
      getUrl: (...args: Parameters<typeof fn>) =>
        new URL(fn(...args), baseUrl).toString(),
    } as BuiltRoute<T>;
  }

  // biome-ignore lint/suspicious/noExplicitAny: recursive object traversal
  const result = {} as any;
  const obj = node as Record<string, unknown>;

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) {
      continue;
    }
    result[key] = buildNode(obj[key], baseUrl);
  }

  return result as BuiltRoute<T>;
};

export const createPathBuilder = <T extends RouteTree>(
  routes: T,
  baseUrl: string
): BuiltRoute<T> => buildNode(routes, baseUrl);
