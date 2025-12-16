import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from './ui/button'
import { Tooltip } from './ui/tooltip'

export const GoHomeButton = () => {
  return (
    <Tooltip label="Return home">
      <Link to="/" className={buttonVariants({ variant: "link" })}>
        <ArrowLeft />
        Go home
      </Link>
    </Tooltip>
  )
}
