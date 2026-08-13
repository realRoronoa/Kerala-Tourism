import { useState } from 'react';

const interestsList = [
  'Nature', 'Beaches', 'Mountains', 'Wildlife', 
  'Food', 'Culture', 'Adventure', 'Peaceful spots'
];

export default function OnboardingView({ onComplete }) {
  const [selected, setSelected] = useState([]);

  const toggleInterest = (interest) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter(i => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  };

  return (
    <div className="flex flex-col h-full pt-8">
      <div className="mb-8">
        <h1>What draws you to Kerala?</h1>
        <p className="mt-4">Pick a few interests, and we'll show you places that match.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {interestsList.map((interest) => (
          <button
            key={interest}
            className={`chip ${selected.includes(interest) ? 'selected' : ''}`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
        <button 
          className="btn btn-primary w-full" 
          onClick={onComplete}
          disabled={selected.length === 0}
          style={{ opacity: selected.length === 0 ? 0.3 : 1 }}
        >
          See Recommendations
        </button>
      </div>
    </div>
  );
}
