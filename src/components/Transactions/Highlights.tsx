import React from 'react';
import {
  faCube,
  faServer,
  faClock,
  faExchangeAlt,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Hightlights: React.FC = () => (
  <div>
    <div className="bg-blue">
      <div className="container pt-4 pb-4">
        <ul className="highlights row">
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faCube} />
            </span>
            <span className="highlight-label">CURRENT BLOCK</span>
            <span className="highlight-value">1,887</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faServer} />
            </span>
            <span className="highlight-label">NUMBER OF SHARDS</span>
            <span className="highlight-value">5</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faClock} />
            </span>
            <span className="highlight-label">CURRENT ROUND</span>
            <span className="highlight-value">26,289</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faExchangeAlt} />
            </span>
            <span className="highlight-label">TPS</span>
            <span className="highlight-value">94</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </span>
            <span className="highlight-label">PEAK TPS</span>
            <span className="highlight-value">819</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faServer} />
            </span>
            <span className="highlight-label">TOTAL TX</span>
            <span className="highlight-value">1,993,034</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default Hightlights;
