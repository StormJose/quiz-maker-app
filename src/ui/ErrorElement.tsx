import { useRouteError } from "react-router"


export default function ErrorElement({errorProp}) {

  if (!errorProp) return

  const error = useRouteError()

  return (
    <div className="mx-4">{error}</div>
  )
}
