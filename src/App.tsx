import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import CatalogPage from "./pages/CatalogPage";
import PerfumeDetailPage from "./pages/PerfumeDetailPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ReviewsPage from "./pages/ReviewsPage";
import VIPPage from "./pages/VIPPage";
import QuizPage from "./pages/QuizPage";
import FindMyScentPage from "./pages/FindMyScentPage";
import FindMyScentFab from "./components/FindMyScentFab";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <FindMyScentFab />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog/:gender" element={<CatalogPage />} />
            <Route path="/perfume/:id" element={<PerfumeDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/vip" element={<VIPPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/find-my-scent" element={<FindMyScentPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
