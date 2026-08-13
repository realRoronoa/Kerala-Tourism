export default function DiscoverView() {
  return (
    <div>
      <div className="mb-6">
        <h1>Discover Kerala</h1>
        <p>Explore places that match your interests.</p>
      </div>

      {/* Card 1: Flat architectural block */}
      <div className="mb-6">
        <img 
          src="https://images.unsplash.com/photo-1593693397690-362bc6386407?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Munnar Tea Estates" 
          className="place-img"
        />
        
        <div className="place-info">
          <div className="place-meta">Munnar</div>
          <h2 className="mb-2">Tea estates via Gap Road</h2>
          
          <div className="flex flex-col gap-2 text-sm text-secondary mb-4 mt-4" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-2">
              <strong style={{ color: 'var(--text-primary)' }}>Crowd level:</strong> Low
            </div>
            <div className="flex items-center gap-2">
              <strong style={{ color: 'var(--text-primary)' }}>Travel time:</strong> 3 hours from Kochi
            </div>
          </div>

          <button className="btn btn-primary mt-4">View Route</button>
        </div>
      </div>

    </div>
  );
}
