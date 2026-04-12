
export const toMessage = (error: unknown): object => error instanceof Error ? error: Object(error);