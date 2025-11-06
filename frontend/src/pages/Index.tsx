import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, TrendingDown, Zap, Leaf, ArrowRight, Clock, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Optimization",
      description: "Advanced algorithms analyze traffic patterns and weather conditions for optimal routing"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Priority-Based Delivery",
      description: "Automatically sort deliveries by time windows and urgency for maximum efficiency"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Real-Time Tracking",
      description: "Monitor delivery progress with GPS tracking and instant notifications"
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Sustainability Metrics",
      description: "Track fuel savings and carbon emission reductions from optimized routes"
    },
    {
      icon: <TrendingDown className="h-6 w-6" />,
      title: "Cost Reduction",
      description: "Reduce last-mile delivery costs by up to 40% with intelligent route planning"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into delivery performance and efficiency gains"
    }
  ];

  const stats = [
    { value: "40%", label: "Cost Reduction" },
    { value: "30%", label: "Faster Deliveries" },
    { value: "25%", label: "Fuel Savings" },
    { value: "20%", label: "Less Emissions" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Milo</span>
            </div>
            <Button variant="hero" onClick={() => navigate("/dashboard")}>
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
                <Leaf className="h-4 w-4" />
                Smart. Sustainable. Efficient.
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Optimize Your Last-Mile{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Delivery Routes
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Reduce costs by 40% and emissions by 20% with AI-powered route optimization. 
                Make every delivery smarter, faster, and greener.
              </p>
              <div className="flex gap-4">
                <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
                  Start Optimizing
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
              <div className="relative rounded-2xl shadow-strong w-full h-96 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <MapPin className="h-32 w-32 text-primary opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Modern Logistics</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform your delivery operations and reduce environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-medium transition-all duration-300 border-border">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center shadow-strong bg-gradient-to-br from-card to-card/80">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Deliveries?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join leading logistics companies using AI-powered route optimization to save costs and protect the environment
            </p>
            <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">Milo</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Milo. Smart delivery route optimization.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

