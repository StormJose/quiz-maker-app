


type Status = "idle" | "ready" | "loading";

type Error = {
    type: string,
    message: string,
};

type CurrentUser = object;

export type InitialState = {
  status: Status;
  error: Error;
  currentUser: CurrentUser;
};

export type Action = {
    type: string,
    payload?: object | string | null 
}