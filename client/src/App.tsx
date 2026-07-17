import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { CookieBanner } from "@/components/cookie-banner";
import { Layout } from "@/components/layout";
import { SeoManager } from "@/components/seo-manager";
import { ContactHoursNotice } from "@/components/contact-hours-notice";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import UserDashboard from "@/pages/user-dashboard";
import NewsPage from "@/pages/news-page";
import MagazinePage from "@/pages/magazine-page";
import NewsDetailPage from "@/pages/news-detail-page";
import CompetitionsPage from "@/pages/competitions-page";
import MembershipPage from "@/pages/membership-page";
import ContactPage from "@/pages/contact-page";
import ScuolaVenatoria from "@/pages/scuola-venatoria";
import Direttivo from "@/pages/direttivo";
import GareCinofile from "@/pages/gare-cinofile";
import GarePesca from "@/pages/gare-pesca";
import GareTiro from "@/pages/gare-tiro";
import PescaTiro from "@/pages/pesca-tiro";
import EventsPage from "@/pages/events-page";
import PrivacyPolicy from "@/pages/privacy-policy";
import CookiePolicy from "@/pages/cookie-policy";

function Router() {
  return (
    <Layout>
      <SeoManager />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/magazine" component={MagazinePage} />
        <Route path="/news/:slug" component={NewsDetailPage} />
        <Route path="/competitions" component={CompetitionsPage} />
        <Route path="/membership" component={MembershipPage} />
        <Route path="/contact">
          {() => (
            <>
              <ContactHoursNotice />
              <ContactPage />
            </>
          )}
        </Route>
        <Route path="/scuola-venatoria" component={ScuolaVenatoria} />
        <Route path="/direttivo" component={Direttivo} />
        <Route path="/gare-cinofile" component={GareCinofile} />
        <Route path="/gare-pesca" component={GarePesca} />
        <Route path="/gare-tiro" component={GareTiro} />
        <Route path="/pesca-tiro" component={PescaTiro} />
        <Route path="/eventi" component={EventsPage} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/dashboard">{() => <ProtectedRoute path="/dashboard" component={UserDashboard} />}</Route>
        <Route path="/admin">{() => <ProtectedRoute path="/admin" component={AdminDashboard} />}</Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieBanner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
