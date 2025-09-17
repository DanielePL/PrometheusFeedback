import React from 'react';
import { PrometheusBetaFeedback } from '../components/feedback';

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <PrometheusBetaFeedback />
      </div>
    </div>
  );
};

export default Feedback;
