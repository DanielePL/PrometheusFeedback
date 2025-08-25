import React from 'react';
import FeedbackForm from '../components/FeedbackForm';

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gradient-prometheus">
      <div className="max-w-md mx-auto px-4 py-8">
        <FeedbackForm />
      </div>
    </div>
  );
};

export default Feedback;
