import React, { useState } from 'react';
import Modal from './Modal';
import './SearchBar.css';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onFilterClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 value,
                                                 onChange,
                                                 placeholder = 'Search...',
                                                 onFilterClick,
                                             }) => {
    const [showFilterModal, setShowFilterModal] = useState(false);

    const handleFilterClick = () => {
        if (onFilterClick) {
            onFilterClick();
        } else {
            setShowFilterModal(true);
        }
    };

    return (
        <>
            <div className="search-bar">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
                    <path d="M16.148 15.352L12.6275 11.8322C13.6479 10.6071 14.1567 9.03585 14.0481 7.4452C13.9395 5.85456 13.2218 4.36701 12.0444 3.29201C10.867 2.21701 9.32041 1.63734 7.72647 1.67356C6.13253 1.70978 4.61392 2.35913 3.48654 3.4865C2.35916 4.61388 1.70982 6.13249 1.6736 7.72643C1.63737 9.32037 2.21705 10.8669 3.29205 12.0444C4.36705 13.2218 5.85459 13.9394 7.44524 14.048C9.03589 14.1566 10.6072 13.6478 11.8322 12.6274L15.3521 16.148C15.4043 16.2002 15.4664 16.2417 15.5347 16.27C15.6029 16.2983 15.6761 16.3128 15.75 16.3128C15.8239 16.3128 15.8971 16.2983 15.9654 16.27C16.0337 16.2417 16.0957 16.2002 16.148 16.148C16.2003 16.0957 16.2417 16.0337 16.27 15.9654C16.2983 15.8971 16.3129 15.8239 16.3129 15.75C16.3129 15.6761 16.2983 15.6029 16.27 15.5346C16.2417 15.4663 16.2003 15.4043 16.148 15.352ZM2.81254 7.875C2.81254 6.87373 3.10945 5.89495 3.66572 5.06243C4.222 4.2299 5.01265 3.58103 5.9377 3.19786C6.86275 2.81469 7.88065 2.71444 8.86268 2.90977C9.84471 3.10511 10.7468 3.58727 11.4548 4.29527C12.1628 5.00328 12.6449 5.90533 12.8403 6.88736C13.0356 7.86938 12.9353 8.88728 12.5522 9.81234C12.169 10.7374 11.5201 11.528 10.6876 12.0843C9.85509 12.6406 8.87631 12.9375 7.87504 12.9375C6.53284 12.936 5.24603 12.4022 4.29695 11.4531C3.34787 10.504 2.81403 9.2172 2.81254 7.875Z" fill="#6B7280" />
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <button
                    className="filter-icon-btn"
                    onClick={handleFilterClick}
                    aria-label="Filter"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                    >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z"
                                stroke="#6B7280"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                    </svg>
                </button>
            </div>

            {showFilterModal && (
                <Modal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)}>
                    <h3>Filter</h3>
                    <p>Filter options will appear here.</p>
                </Modal>
            )}
        </>
    );
};

export default SearchBar;