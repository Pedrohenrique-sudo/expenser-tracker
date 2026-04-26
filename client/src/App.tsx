import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path={""} component={Home} />
      <Route path={"/transactions"} component={Transactions} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/budgets"} component={Budgets} />
      <Route path={"/goals"} component={Goals} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <ExpenseProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ExpenseProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
