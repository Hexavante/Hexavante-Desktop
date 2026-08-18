import { AppProviders } from './providers/AppProviders'
import { AppRouter } from './routes'

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
