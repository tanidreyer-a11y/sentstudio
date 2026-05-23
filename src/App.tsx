import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import Index from "./pages/Index";
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const PerfumeDetailPage = lazy(() => import("./pages/PerfumeDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const FindMyScentPage = lazy(() => import("./pages/FindMyScentPage"));
const ExclusivePage = lazy(() => import("./pages/ExclusivePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminBlogPage = lazy(() => import("./pages/AdminBlogPage"));
const AdminCalendarPage = lazy(() => import("./pages/AdminCalendarPage"));
const AdminPostEditorPage = lazy(() => import("./pages/AdminPostEditorPage"));
const AdminLeadsPage = lazy(() => import("./pages/AdminLeadsPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentCancelPage = lazy(() => import("./pages/PaymentCancelPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
import FindMyScentFab from "./components/FindMyScentFab";
import ScrollToTop from "./components/ScrollToTop";
import DiscountPopup from "./components/DiscountPopup";
import UrgencyBar from "./components/UrgencyBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <UrgencyBar />
          <FindMyScentFab />
          <DiscountPopup />
          <Suspense fallback={null}>
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
            <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrdersPage /></ProtectedAdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
