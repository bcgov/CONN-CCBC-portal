'use client';

import dynamic from 'next/dynamic';

const LazyMap = dynamic(() => import('./SummaryMap'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const MapCaller = (props) => {
  return (
    <div>
      <LazyMap {...props} />
    </div>
  );
};

export default MapCaller;
