import React from 'react';


const AppBreadCrumb = props => {

    const { values } = props;

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-geo-alt-fill mx-2 text-danger" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
                {values.map(value => <li key={value} className="breadcrumb-item text-primary">{value}</li>)}
            </ol>
        </nav>
    );

};

export default AppBreadCrumb;