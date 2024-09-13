import React from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import { MOBILE_MAX_WIDTH } from '../../utils/constants';

const BackButton = () => {
    const router = useRouter();

    const isMobile = useMediaQuery({ maxWidth: MOBILE_MAX_WIDTH });

    return (
        <>
            {isMobile &&
                <div className="back-button-container">
                    {/* Trigger back navigation */}
                    <button
                        className="btn btn-outline-primary d-flex align-items-center"
                        onClick={() => router.back()}
                    >
                        <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                        Go Back
                    </button>
                </div>
            }
        </>
    );
};

export default BackButton;
