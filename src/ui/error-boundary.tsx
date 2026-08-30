import { isRouteErrorResponse, useRouteError } from "react-router"


export default function ErrorBoundary() {

  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h3>{error.status} - {error.statusText}</h3>
      </div>
    )
  }

   if (error instanceof Error) {
    return (
      <div>
        <h3>{error.message}</h3>
      </div>
    );
  }

  if (typeof error === "string") {
    return (
      <div>
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div>

        <h3>
            Erro inesperado.
        </h3>
    </div>
  )
}
