import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import Index from "./pages/Index";
import CatalogPage from "./pages/CatalogPage";
import PerfumeDetailPage from "./pages/PerfumeDetailPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ReviewsPage from "./pages/ReviewsPage";

import QuizPage from "./pages/QuizPage";
import FindMyScentPage from "./pages/FindMyScentPage";
import ExclusivePage from "./pages/ExclusivePage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import LoginPage from "./pages/LoginPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminCalendarPage from "./pages/AdminCalendarPage";
import AdminPostEditorPage from "./pages/AdminPostEditorPage";
import AdminLeadsPage from "./pages/AdminLeadsPage";
import FindMyScentFab from "./components/FindMyScentFab";
import ScrollToTop from "./components/ScrollToTop";
import EntryDiscountPopup from "./components/EntryDiscountPopup";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <FindMyScentFab />
          <EntryDiscountPopup />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog/:gender" element={<CatalogPage />} />
            <Route path="/perfume/:id" element={<PerfumeDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/find-my-scent" element={<FindMyScentPage />} />
            <Route path="/exclusive" element={<ExclusivePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminBlogPage /></ProtectedAdminRoute>} />
            <Route path="/admin/blog" element={<ProtectedAdminRoute><AdminBlogPage /></ProtectedAdminRoute>} />
            <Route path="/admin/calendar" element={<ProtectedAdminRoute><AdminCalendarPage /></ProtectedAdminRoute>} />
            <Route path="/admin/post/:id" element={<ProtectedAdminRoute><AdminPostEditorPage /></ProtectedAdminRoute>} />
            <Route path="/admin/leads" element={<ProtectedAdminRoute><AdminLeadsPage /></ProtectedAdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
