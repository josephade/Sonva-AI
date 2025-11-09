const Dashboard = () => {
  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See Every Dental Inquiry
            <span className="block text-primary">Turn Into Patients</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Track which calls book appointments, request emergency care, or need your team's attention.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-50 rounded-3xl" />
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
            {/* ✅ Use public path */}
            <img
              src="/dashboard-preview.jpg"
              alt="Sonva AI Dashboard showing call analytics and appointment conversion rates"
              className="w-full h-auto"
            />
          </div>

          {/* Stats Overlay */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">156</div>
              <div className="text-sm text-muted-foreground">Calls This Week</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">148</div>
              <div className="text-sm text-muted-foreground">Appointments Booked</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">94.8%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
