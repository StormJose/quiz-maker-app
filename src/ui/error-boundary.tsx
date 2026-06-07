import { useRouteError } from "react-router"


export default function ErrorBoundary() {

    const error = useRouteError()

  return (
    <div>

        <h3>
            {error.message}
        </h3>
    </div>
  )
}
