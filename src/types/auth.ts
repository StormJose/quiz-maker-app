


export type Status = "idle" | "ready" | "loading";

export type AuthError = {
    type: string,
    message: string,
};

export type CurrentUser = object | string | null;

export type InitialState = {
  status: Status;
  error: AuthError;
  currentUser: CurrentUser;
};

export type Action = {
    type: string,
    payload?: object | string | null
}