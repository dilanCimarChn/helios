// src/components/CompanyList.jsx
import React from 'react';
import { companies } from './data';
import './CompanyList.css';

const CompanyList = () => {
  return (
    <div className="company-list">
        <a className='titulo'>Lista de convenios</a>
      {companies.map((company) => (
        <a
          key={company.id}
          href={company.link}
          target="_blank"
          rel="noopener noreferrer"
          className="company-item"
        >
          <img src={company.image} alt={company.title} className="company-image" />
          <div className="company-info">
            <h4 className="company-title">{company.title}</h4>
            <p className="company-type">{company.type}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default CompanyList;
